
import { useEffect, useState } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const LiveClass = () => {
  const [totalStudents, setTotalStudents] = useState(0)
  const [isLive, setIsLive] = useState(false);
  const [presentStudents, setPresentStudents] = useState([]);


  const {classId} = useParams()

  useEffect(()=>{
    const fetchClass = async () =>{
      const res = await api.get(`/class/${classId}`);
      setTotalStudents(res.data.data.studentsIds.length);
    }
    fetchClass()
  },[])

  // const token = localStorage.getItem("token");

  const { send } = useWebSocket(true, (msg) => {
    console.log("WS MESSAGE:", msg);

    // ✅ class started
    if (msg.type === "CLASS_STARTED") {
      setIsLive(true);
    }

    // ✅ student marked present
    if (msg.type === "STUDENT_PRESENT") {
      setPresentStudents((prev)=>{
        const exits = prev.find(
          (s) => s.id === msg.student.id
        )
        if(exits) return prev;
        return [...prev,msg.student]
      })
    }

    // ✅ class stopped
    if (msg.type === "CLASS_STOPPED") {
      setIsLive(false);
      setPresentStudents([]);
    }
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Class</h2>

      {/* STATUS */}
      <p>Status: {isLive ? "🟢 Live" : "🔴 Not Live"}</p>

      {/* ACTIONS */}
      <button disabled={isLive} onClick={() => send({ type: "START_CLASS" })}>
        Start Class
      </button>

      <button disabled={!isLive} onClick={() => send({ type: "STOP_CLASS" })}>
        Stop Class
      </button>

      {/* LIVE ATTENDANCE */}
      <h3>Present Students : {presentStudents.length}</h3>

      {presentStudents.length === 0 && <p>No students marked present yet</p>}
      <h4>
        Present: {presentStudents.length} | Absent:{" "}
        {totalStudents - presentStudents.length}
      </h4>

      <ul>
        {presentStudents.map((s) => (
          <li key={s.id}>
            <strong>Name : {s.name}</strong> <br />
            email: {s.email}
            <span style={{ color: "green", marginLeft: 10 }}>● Present</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveClass;