"use client";
import { Game } from "@/draw/Game";
import { useEffect, useState, useRef } from "react";

export type Tool = "rect" | "circ" | "line" | null;
export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const [selected, setClicked] = useState<Tool>(null);
  const [game, setGame] = useState<Game | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    game?.setShape(selected);
  }, [selected, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);
      return () => {
        g.destroy();
      };
    }
  }, [canvasRef, roomId, socket]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas className="absolute top-0 left-0" ref={canvasRef}></canvas>
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setClicked("rect")}
          className={`
            px-4 py-2 mx-2 rounded-md
            ${selected === "rect" ? "bg-blue-500" : "bg-gray-400"}
            text-white font-medium
            hover:bg-opacity-90 transition-colors
          `}
        >
          Rectangle
        </button>
        <button
          onClick={() => setClicked("circ")}
          className={`
            px-4 py-2 mx-2 rounded-md
            ${selected === "circ" ? "bg-blue-500" : "bg-gray-400"}
            text-white font-medium
            hover:bg-opacity-90 transition-colors
          `}
        >
          Circle
        </button>
        <button
          onClick={() => setClicked("line")}
          className={`
            px-4 py-2 mx-2 rounded-md
            ${selected === "line" ? "bg-blue-500" : "bg-gray-400"}
            text-white font-medium
            hover:bg-opacity-90 transition-colors
          `}
        >
          Line
        </button>
      </div>{" "}
    </div>
  );
}
