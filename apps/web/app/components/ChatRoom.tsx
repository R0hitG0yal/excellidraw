import axios from "axios";
import { BACKEND_URL } from "../config";
import { ChatRoomClient } from "./ChatRoomClient";
import { JSX } from "react/jsx-runtime";

async function getChats(roomId: string) {
  const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  return res.data.messages;
}

export async function ChatRoom({ id }: { id: string }): Promise<JSX.Element> {
  const messages = await getChats(id);
  return <ChatRoomClient id={id} messages={messages}></ChatRoomClient>;
}
