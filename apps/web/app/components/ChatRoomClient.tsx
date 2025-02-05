"use client";

import { Key, useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: {
    [x: string]: Key | null | undefined;
    message: string;
  }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const { socket, loading } = useSocket();
  const [currentMessage, setCurrentMessage] = useState("");
  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join-room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((c) => [...c, { message: parsedData.message }]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <div>
      {chats.map((message) => {
        return <div key={message.id}>{message.message}</div>;
      })}
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      ></input>
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );

          setCurrentMessage("");
        }}
      >
        Send Message
      </button>
    </div>
  );
}
