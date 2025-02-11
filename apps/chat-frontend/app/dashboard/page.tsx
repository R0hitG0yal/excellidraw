"use client";
import { PlusCircle, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { BACKEND_URL, ROOM_SERVICE_URL } from "@/config";
import axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';

const Index = () => {
  const [roomCode, setRoomCode] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async () => {
    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await axios.post(
        `${BACKEND_URL}/room`,
        { name: roomCode },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      toast.success("Room created successfully!");
      window.location.href = `${ROOM_SERVICE_URL}/room/${roomCode}`;
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 400:
            toast.error("Invalid room name format");
            break;
          case 401:
            toast.error("Please login to create a room");
            break;
          case 409:
            toast.error("Room already exists with this name");
            break;
          default:
            toast.error("Failed to create room. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Room creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    console.log('Joining room', roomCode);
    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }

    setIsLoading(true);
    try {
      // Verify if room exists before joining
      const token = Cookies.get('token');
      await axios.get(`${BACKEND_URL}/room/${roomCode}`, {
        headers: {
          Authorization: token,
        },
      });

      window.location.href = `${ROOM_SERVICE_URL}/room/${roomCode}`;
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 404:
            toast.error("Room not found");
            break;
          case 401:
            toast.error("Please login to join the room");
            break;
          default:
            toast.error("Failed to join room. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
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
            {!showCreateRoom && <Button
              onClick={() => setShowCreateRoom(true)}
              className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 transition-all duration-200"
            >
              <div className="w-full flex justify-center">
                <PlusCircle className="mr-2" />
                <span> Create New Room</span>
              </div>
            </Button>}

            {
              showCreateRoom &&
              <>
                <Input
                  type="text"
                  placeholder="Enter name/slug for the room"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full h-12 text-lg text-gray-700 outline rounded p-4"
                />
                <Button
                  onClick={handleCreateRoom}
                  className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 transition-all duration-200"
                >
                  <div className="w-full flex justify-center">
                    <span> Create New Room</span>
                  </div>
                </Button>
              </>
            }

            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <div className="relative text-center my-4">
                <span className="bg-white px-4 text-sm text-gray-500">
                  or join existing
                </span>
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              {!showCreateRoom && <Input
                type="text"
                placeholder="Enter room slug"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full h-12 text-lg outline rounded p-4"
              />}
              <Button
                onClick={() => {
                  setShowCreateRoom(false);
                  handleJoinRoom();
                }}
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
