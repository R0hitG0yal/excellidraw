import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

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
  private flushInterval: number = 5000;

  constructor() {
    setInterval(() => this.processQueue(), this.flushInterval);
  }

  async enqueue(message: QueueMessage) {
    this.queue.push(message);
    if (this.queue.length >= this.batchSize) {
      await this.processQueue();
    }
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    const batch = this.queue.splice(0, this.batchSize);

    try {
      this.processing = true;
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
      this.queue.unshift(...batch);
    } finally {
      this.processing = false;
    }
  }
}

const messageQueue = new MessageQueue();

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded || !decoded.userId) return null;
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

  const user: User = {
    userId,
    rooms: [],
    ws,
  };
  users.push(user);

  ws.on("error", console.error);

  ws.on("message", async function message(data) {
    try {
      const parsedData = JSON.parse(data.toString());

      if (parsedData.type === "join-room") {
        const roomId = parsedData.roomId.toString();
        if (!user.rooms.includes(roomId)) {
          user.rooms.push(roomId);
          // Notify other users in the room about the new user
          users.forEach((u) => {
            if (u.rooms.includes(roomId)) {
              u.ws.send(
                JSON.stringify({
                  type: "user-joined",
                  userId: user.userId,
                  roomId,
                })
              );
            }
          });
        }
      }

      if (parsedData.type === "leave-room") {
        const roomId = parsedData.roomId.toString();
        user.rooms = user.rooms.filter((x) => x !== roomId);
        // Notify other users about the leave
        users.forEach((u) => {
          if (u.rooms.includes(roomId)) {
            u.ws.send(
              JSON.stringify({
                type: "user-left",
                userId: user.userId,
                roomId,
              })
            );
          }
        });
      }

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId.toString();
        const message = parsedData.message;

        if (!user.rooms.includes(roomId)) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "You are not in this room",
            })
          );
          return;
        }

        await messageQueue.enqueue({
          type: "chat",
          userId: user.userId,
          message,
          roomId,
        });

        // Broadcast message to all users in the room
        users.forEach((u) => {
          if (u.rooms.includes(roomId)) {
            u.ws.send(
              JSON.stringify({
                type: "chat",
                userId: user.userId,
                message,
                roomId,
                timestamp: new Date().toISOString(),
              })
            );
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        })
      );
    }
  });

  // Send initial connection success message
  ws.send(
    JSON.stringify({
      type: "connected",
      userId: user.userId,
    })
  );

  // Clean up when connection closes
  ws.on("close", () => {
    const index = users.findIndex((u) => u.userId === userId);
    if (index !== -1) {
      const userRooms = [...(users[index]?.rooms ?? [])];
      users.splice(index, 1);

      // Notify other users about the disconnection
      userRooms.forEach((roomId) => {
        users.forEach((u) => {
          if (u.rooms.includes(roomId)) {
            u.ws.send(
              JSON.stringify({
                type: "user-disconnected",
                userId: userId,
                roomId,
              })
            );
          }
        });
      });
    }
  });
});
