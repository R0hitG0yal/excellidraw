"use client";
import { PlusCircle, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { ROOM_SERVICE_URL } from "@/config";

const Index = () => {
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = () => {
    // This is a placeholder - we'll implement actual room creation later
    const roomId = Math.random().toString(36).substring(7);
    toast.success(`Room created with ID: ${roomId}`);
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }
    // This is a placeholder - we'll implement actual room joining later
    window.location.href = `${ROOM_SERVICE_URL}/room/${roomCode}`;
    toast.success(`Joining room: ${roomCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat Rooms</h1>
          <p className="text-gray-600">
            Create a new room or join an existing one
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Button
              onClick={handleCreateRoom}
              className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 transition-all duration-200"
            >
              <div className="w-full flex justify-center">
                <PlusCircle className="mr-2" />
                <span> Create New Room</span>
              </div>
            </Button>

            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <div className="relative text-center my-4">
                <span className="bg-white px-4 text-sm text-gray-500">
                  or join existing
                </span>
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <Input
                type="text"
                placeholder="Enter room slug"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full h-12 text-lg outline rounded p-4"
              />
              <Button
                onClick={handleJoinRoom}
                className="w-full h-12 text-lg border-2"
              >
                <div className="w-full flex justify-center">
                  <Users className="mr-2" />
                  Join Room
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
