import { useEffect, useRef } from "react";

const useWebSocket = (enabled,onMessage) => {
  const wsRef = useRef(null);

  useEffect(() => {

    if(!enabled) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const ws = new WebSocket(
      `ws://localhost:8080?token=${token}`
    );

    ws.onopen = () => console.log("WS connected");
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        // ✅ SAFETY CHECK
        if (typeof onMessage === "function") {
          onMessage(data);
        }
      } catch (err) {
        console.error("Invalid WS message", err);
      }
    }
    ws.onclose = () => console.log("WS closed");

    wsRef.current = ws;

    return () => ws.close();
  }, [enabled]);

  const send = (data) => {
    if(wsRef.current?.readyState ===1){
      wsRef.current.send(JSON.stringify(data))
    }
  };

  return { send };
};

export default useWebSocket;
