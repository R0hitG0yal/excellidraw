import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../components/ChatRoom";
import { JSX } from "react/jsx-dev-runtime";

async function getRoomId(slug: string) {
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
  console.log(response);

  return response.data.room.id;
}

export default async function ChatRoom1({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<JSX.Element> {
  const slug = (await params).slug;
  const roomId = await getRoomId(slug);

  return (
    <div className="bg-blue-200 h-screen">
      <ChatRoom id={roomId}></ChatRoom>
    </div>
  );
}
