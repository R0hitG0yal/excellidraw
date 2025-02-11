import { BACKEND_URL } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    shadowColor?: string;
    shadowBlur?: number;
    cornerRadius?: number;
} | {
    type: "circle";
    x: number;
    y: number;
    radius: number;
    color: string;
    shadowColor: string;
    shadowBlur: number;
    cornerRadius: number;
    fill: boolean;
    stroke: boolean;
    strokeWidth: number;
    strokeColor: string;
    dashOffset: number;
    dashArray: number[];
} | {
    type: "line";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    color: string;
    shadowColor: string;
    shadowBlur: number;
    lineCap: "butt" | "round" | "square";
    lineJoin: "round" | "bevel" | "miter";
    miterLimit: number;
    dashOffset: number;
    dashArray: number[];
} | {
    type: "text";
    x: number;
    y: number;
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    align: "left" | "center" | "right";
    baseline: "top" | "middle" | "bottom";
    lineHeight: number;
    maxWidth: number;
    maxHeight: number;
    padding: number;
    shadowColor: string;
    shadowBlur: number;
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.fillStyle = "rgba(0,0,0)";
    ctx.strokeStyle = "rgba(255,255,255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let existingShapes: Shape[] = await getExistingShapes(roomId);
    clearCanvas(existingShapes, canvas, ctx);


    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log(data);
        if (data.type == "chat") {
            const parsedShape = JSON.parse(data.message);
            existingShapes.push(parsedShape);
            // console.log("existing shapes", existingShapes);
            clearCanvas(existingShapes, canvas, ctx)
        }
    }

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener('mousedown', (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener('mouseup', (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        const shape = {
            type: "rect",
            x: startX,
            y: startY,
            width: width,
            height: height
        };
        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId,
        }));
        clearCanvas(existingShapes, canvas, ctx);
    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(startX, startY, width, height);
        }
    });
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255)";

    console.log("existing shapes==>", existingShapes);

    existingShapes.forEach((item) => {
        if (!item.shape) return;
        switch (item.shape.type) {
            case "rect":
                const { x, y, width, height } = item.shape;

                // Adjust for negative width and height
                const adjX = width < 0 ? x + width : x;
                const adjY = height < 0 ? y + height : y;
                const adjWidth = Math.abs(width);
                const adjHeight = Math.abs(height);

                ctx.strokeRect(adjX, adjY, adjWidth, adjHeight);
                // ctx.fillStyle = shape.color;
                // ctx.shadowColor = shape.shadowColor;
                // ctx.shadowBlur = shape.shadowBlur;
                // ctx.fillRect(adjX, adjY, adjWidth, adjHeight);
                break;
            case "circle":
                // ctx.fillStyle = shape.color;
                // ctx.shadowColor = shape.shadowColor;
                // ctx.shadowBlur = shape.shadowBlur;
                ctx.beginPath();
                ctx.arc(item.shape.x, item.shape.y, item.shape.radius, 0, 2 * Math.PI);
                ctx.fill();
                break;
            // case "line":
            //     ctx.strokeStyle = shape.color;
            //     ctx.shadowColor = shape.shadowColor;
            //     ctx.shadowBlur = shape.shadowBlur;
            //     ctx.lineWidth = shape.width;
            //     ctx.setLineDash(shape.dashArray);
            //     ctx.lineCap = shape.lineCap;
            //     ctx.lineJoin = shape.lineJoin;
            //     ctx.miterLimit = shape.miterLimit;
            //     ctx.beginPath();
            //     ctx.moveTo(shape.x1, shape.y1);
            //     ctx.lineTo(shape.x2, shape.y2);
            //     ctx.stroke();
            //     break;
            // case "text":
            //     ctx.fillStyle = shape.color;
            //     ctx.shadowColor = shape.shadowColor;
            //     ctx.shadowBlur = shape.shadowBlur;
            //     ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;
            //     ctx.textAlign = shape.align;
            //     ctx.textBaseline = shape.baseline;
            //     ctx.fillText(shape.text, shape.x, shape.y);
            //     break;
        }
    });
}

// async function getExistingShapes(roomId: string) {
//     const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
//     const messages = res.data.messages;
//     const shapes = messages.map((x: { message: string; }) => {
//         const parsedData = JSON.parse(x.message);
//         return parsedData;
//     })

//     return shapes;
// }

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages = res.data.messages;

    const uniqueShapes = new Map(); // Using Map to store unique shapes

    messages.forEach((x: { message: string }) => {
        try {
            const parsedData = JSON.parse(x.message);
            const shapeKey = JSON.stringify(parsedData.shape); // Key for uniqueness check
            uniqueShapes.set(shapeKey, parsedData);
        } catch (error) {
            console.error("Error parsing message:", x.message, error);
        }
    });

    // console.log(Array.from(uniqueShapes.values()), "unique shapes");

    return Array.from(uniqueShapes.values()); // Return unique shapes
}