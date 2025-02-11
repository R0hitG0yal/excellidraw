"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react"

export default function () {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current);
        }
    }, [canvasRef]);

    return <div>
        <canvas ref={canvasRef} ></canvas>
    </div>
}