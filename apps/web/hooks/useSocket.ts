import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MmRiYWQ5Yy01NDUyLTRjODgtOTU3Ni01MTdkN2ZkZjUxNzAiLCJpYXQiOjE3MzgzOTAwNjV9.7Ve_pdNzr-B1nnA1pdo6gDMHUbnHDenzNd_eriogXsc`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    socket,
    loading,
  };
}
