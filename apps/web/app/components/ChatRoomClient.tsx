"use client";
import { Key, useEffect, useState, useRef } from "react";
import { useSocket } from "../../hooks/useSocket";
import { Send, Loader } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

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

  const handleSendMessage = () => {
    if (currentMessage.trim() === "") return;

    socket?.send(
      JSON.stringify({
        type: "chat",
        roomId: id,
        message: currentMessage,
      })
    );

    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Chat Room</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-white">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">Connecting...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-white">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Connected</span>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {chats.map((message, index) => (
          <div key={message.id || index} className="max-w-[80%] break-words">
            <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
              <p className="text-gray-800">{message.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <textarea
            className="flex-1 resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={1}
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || currentMessage.trim() === ""}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
