"use client";
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import Cookies from "js-cookie";

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = Cookies.get("token");
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

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