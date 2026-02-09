import { useState } from "react";
import useWebSocket from "../../hooks/useWebSocket";

const StudentLiveClass = () => {
  const [status, setStatus] = useState("waiting"); 
  // waiting | live | marked

  const { send } = useWebSocket(true,(msg) => {
    console.log("WS MESSAGE:", msg);

    if (msg.type === "CLASS_STARTED") {
      setStatus("live");
    }

    if (msg.type === "PRESENT_MARKED") {
      setStatus("marked");
    }
  });

  const markPresent = () => {
    send({ type: "MARK_PRESENT" });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Class</h2>

      {status === "waiting" && (
        <p>⏳ Waiting for teacher to start the class...</p>
      )}

      {status === "live" && (
        <>
          <p>🟢 Class is live</p>
          <button onClick={markPresent}>Mark Present</button>
        </>
      )}

      {status === "marked" && (
        <p>✅ Attendance marked successfully</p>
      )}
    </div>
  );
};

export default StudentLiveClass;
