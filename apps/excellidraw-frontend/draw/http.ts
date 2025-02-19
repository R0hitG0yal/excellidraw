import { BACKEND_URL } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
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
