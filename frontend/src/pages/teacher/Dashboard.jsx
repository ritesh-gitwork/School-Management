import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import "./TeacherDashboard.css";
import NameHeader from "../../component/NameHeader";

const TeacherDashboard = () => {
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const socketRef = useRef(null);
  const itemsPerPage = 5;

  // ✅ Fetch Classes
  const fetchClasses = async () => {
    try {
      const res = await api.get("/class/getclass");
      setClasses(res.data.data);
    } catch (err) {
      alert("Failed to load classes");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // ✅ WebSocket Connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = new WebSocket(`ws://localhost:8080?token=${token}`);

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WS Connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WS Message:", data);

      if (data.type === "CLASS_STATUS") {
        setClasses((prev) =>
          prev.map((cls) => {
            if (String(cls._id) === String(data.classId)) {
              return {
                ...cls,
                isLive: data.isLive,
              };
            }
            return cls;
          }),
        );
      }
    };

    socket.onerror = (err) => {
      console.log("❌ WS Error", err);
    };

    socket.onclose = () => {
      console.log("🔴 WS Closed");
    };

    return () => socket.close();
  }, []);

  // ✅ Create Class
  const createClass = async () => {
    if (!className) return alert("Class name required");

    try {
      setLoading(true);
      await api.post("/class/create-class", { className });
      setClassName("");
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.error || "Class already exists");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Start / Stop via WebSocket
  const handleToggleLive = (classId, isLive) => {
    if (!socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: isLive ? "STOP_CLASS" : "START_CLASS",
        classId,
      }),
    );
  };

  // 🔎 Search Filter
  const filteredClasses = classes.filter((cls) =>
    cls.className.toLowerCase().includes(search.toLowerCase()),
  );

  // 📄 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentClasses = filteredClasses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <NameHeader />

        <div className="add-class">
          <input
            placeholder="Enter class name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <button onClick={createClass}>
            {loading ? "Creating..." : "+ Add Class"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          placeholder="Search class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="class-card">
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Students</th>
              <th>Status</th>
              <th>Manage</th>
              <th>Live</th>
            </tr>
          </thead>

          <tbody>
            {currentClasses.map((cls) => (
              <tr key={cls._id}>
                <td>{cls.className}</td>
                <td>{cls.studentsIds.length}</td>

                {/* ✅ Dynamic Status */}
                <td>
                  <span
                    className={`badge ${cls.isLive ? "active" : "inactive"}`}
                  >
                    {cls.isLive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <Link
                    to={`/teacher/class/${cls._id}/students`}
                    className="btn manage"
                  >
                    Manage
                  </Link>
                </td>

                {/* ✅ Start / Stop */}
                <td>
                  <button
                    onClick={() => handleToggleLive(cls._id, cls.isLive)}
                    className={`btn ${cls.isLive ? "stop" : "live"}`}
                  >
                    {cls.isLive ? "Stop" : "Start"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active-page" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
