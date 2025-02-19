import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      color?: string;
      shadowColor?: string;
      shadowBlur?: number;
      cornerRadius?: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
      // color: string;
      // shadowColor: string;
      // shadowBlur: number;
      // cornerRadius: number;
      // fill: boolean;
      // stroke: boolean;
      // strokeWidth: number;
      // strokeColor: string;
      // dashOffset: number;
      // dashArray: number[];
    }
  | {
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      // width: number;
      // color: string;
      // shadowColor: string;
      // shadowBlur: number;
      // lineCap: "butt" | "round" | "square";
      // lineJoin: "round" | "bevel" | "miter";
      // miterLimit: number;
      // dashOffset: number;
      // dashArray: number[];
    };
// | {
//     type: "text";
//     x: number;
//     y: number;
//     text: string;
//     fontSize: number;
//     fontFamily: string;
//     color: string;
//     align: "left" | "center" | "right";
//     baseline: "top" | "middle" | "bottom";
//     lineHeight: number;
//     maxWidth: number;
//     maxHeight: number;
//     padding: number;
//     shadowColor: string;
//     shadowBlur: number;
// }

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private isDrawing: boolean;
  private startX: number = 0;
  private startY: number = 0;
  private selectedTool: Tool = "rect";
  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.isDrawing = false;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
  }

  setShape(tool: Tool) {
    this.selectedTool = tool;
  }

  async init(): Promise<void> {
    try {
      this.existingShapes = await getExistingShapes(this.roomId);
      this.clearCanvas();
    } catch (error) {
      console.error("Failed to initialize shapes:", error);
    }
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          const parsedShape = JSON.parse(data.message);
          if (parsedShape.shape) {
            this.existingShapes.push(parsedShape.shape);
            this.clearCanvas();
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "rgba(255,255,255)";

    console.log("existing", this.existingShapes);

    this.existingShapes.forEach((item) => {
      if (!item.shape) return;

      this.ctx.beginPath();
      this.ctx.strokeStyle = "rgba(255,255,255)";

      switch (item.shape.type) {
        case "rect":
          const { x, y, width, height } = item.shape;

          // Adjust for negative width and height
          const adjX = width < 0 ? x + width : x;
          const adjY = height < 0 ? y + height : y;
          const adjWidth = Math.abs(width);
          const adjHeight = Math.abs(height);

          this.ctx.strokeRect(adjX, adjY, adjWidth, adjHeight);
          break;

        case "circle":
          this.ctx.arc(
            item.shape.x,
            item.shape.y,
            Math.abs(item.shape.radius),
            0,
            2 * Math.PI
          );
          this.ctx.stroke();
          break;

        case "line":
          this.ctx.beginPath();
          this.ctx.moveTo(item.shape.x1, item.shape.y1);
          this.ctx.lineTo(item.shape.x2, item.shape.y2);
          this.ctx.stroke();
          break;
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
      this.ctx.closePath();
    });
  }

  mouseDownHandler = (e) => {
    this.isDrawing = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  };
  mouseUpHandler = (e) => {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;
    const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
    const shape = this.createShape(
      this.selectedTool,
      this.startX,
      this.startY,
      width,
      height,
      radius,
      e.clientX,
      e.clientY
    );
    if (shape) {
      this.existingShapes.push(shape);
      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId: this.roomId,
        })
      );
      this.clearCanvas();
    }
  };
  mouseMoveHandler = (e) => {
    if (!this.isDrawing) return;

    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;
    const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

    this.clearCanvas();
    this.ctx.strokeStyle = "rgba(255,255,255)";
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgba(255,255,255)";
    switch (this.selectedTool) {
      case "rect":
        this.ctx.strokeRect(this.startX, this.startY, width, height);
        break;

      case "circ":
        this.ctx.arc(
          this.startX + width / 2,
          this.startY + height / 2,
          radius / 2,
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
        break;

      case "line":
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(e.clientX, e.clientY);
        this.ctx.stroke();
        break;
    }
    this.ctx.closePath();
  };

  private initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  private createShape(
    type: "rect" | "circ" | "line",
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    x2: number,
    y2: number
  ): Shape | null {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    switch (type) {
      case "rect":
        return { shape: { type: "rect", x, y, width, height } };
      case "circ":
        return { shape: { type: "circle", x: centerX, y: centerY, radius } };
      case "line":
        return { shape: { type: "line", x1: x, y1: y, x2, y2 } };
      default:
        return null;
    }
  }
}
