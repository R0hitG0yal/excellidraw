import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

// Message Queue interface
interface QueueMessage {
  type: "chat";
  userId: string;
  message: string;
  roomId: string;
}

class MessageQueue {
  private queue: QueueMessage[] = [];
  private processing: boolean = false;
  private batchSize: number = 10;
  private flushInterval: number = 5000; // 5 seconds

  constructor() {
    // Periodically flush the queue
    setInterval(() => this.processQueue(), this.flushInterval);
  }

  async enqueue(message: QueueMessage) {
    this.queue.push(message);

    // If queue size exceeds batch size, process immediately
    if (this.queue.length >= this.batchSize) {
      await this.processQueue();
    }
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    const batch = this.queue.splice(0, this.batchSize);

    try {
      this.processing = true;

      // Process messages in batch
      await prismaClient.$transaction(
        batch.map((msg) =>
          prismaClient.chat.create({
            data: {
              userId: msg.userId,
              message: msg.message,
              roomId: parseInt(msg.roomId),
            },
          })
        )
      );
    } catch (error) {
      console.error("Failed to process message queue:", error);
      // On failure, add messages back to the queue
      this.queue.unshift(...batch);
    } finally {
      this.processing = false;
    }
  }
}

const messageQueue = new MessageQueue();
//We need to have stateful backends whenever we work with web sockets as
//we need to maintain which user is connected to which rooms and we can't store
//the data on the db because this is happening real time and it would cost a lot
//to query a db so we can use "Redux, a global variable or singletons" for
//doing the same.
interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}
const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || !(decoded as JwtPayload).userId) return null;
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("error", console.error);

  ws.on("message", async function message(data) {
    //Structure
    //{type: "join-room", roomId: 1}
    //{type: "chat", roomId: 123, message: "Hi there"}
    const parsedData = JSON.parse(data as unknown as string);

    //Add checks only if this room exists and user has access can he join.
    //Persist things in DB
    if (parsedData.type == "join-room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type == "leave-room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) return;
      user.rooms = user?.rooms?.filter((x) => x === parsedData.room);
    }

    if (parsedData.type == "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      //Writing to DB
      // await prismaClient.chat.create({
      //   data: {
      //     userId,
      //     message,
      //     roomId,
      //   },
      // });

      // Instead of directly writing to DB, add to queue
      await messageQueue.enqueue({
        type: "chat",
        userId,
        message,
        roomId,
      });

      // Broadcast message to connected users immediately
      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              roomId,
            })
          );
        }
      });
    }
  });

  ws.send("something");
});
