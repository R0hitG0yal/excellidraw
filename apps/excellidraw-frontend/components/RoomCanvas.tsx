"use client";
import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MmRiYWQ5Yy01NDUyLTRjODgtOTU3Ni01MTdkN2ZkZjUxNzAiLCJpYXQiOjE3MzkyNTg3NTl9.vPet6j2MxcfIMqvz_0i356xNzHNtcaMzoBbJfvV4gUY`);

        ws.onopen = () => {
            setSocket(ws);

            ws.send(JSON.stringify({
                type: "join-room",
                roomId
            }))
        }
    }, []);



    if (!socket)
        return <div>
            Connecting to Server...
        </div>

    return <div>
        <Canvas roomId={roomId} socket={socket} ></Canvas>
    </div>
}