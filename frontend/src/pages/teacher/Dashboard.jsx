import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";


const TeacherDashboard = () => {
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 fetch teacher classes
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

  // 🔹 create class
  const createClass = async () => {
    if (!className) return alert("Class name required");

    try {
      setLoading(true);
      await api.post("/class/create-class", { className });
      setClassName("");
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Teacher Dashboard</h2>

      {/* Create Class */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Enter class name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <button onClick={createClass} disabled={loading}>
          {loading ? "Creating..." : "Create Class"}
        </button>
      </div>

      {/* Class List */}
      <h3>My Classes</h3>

      {classes.length === 0 && <p>No classes created yet</p>}

      <ul>
        {classes.map((cls) => (
          <li key={cls._id} style={{ marginBottom: 10 }}>
            <strong>{cls.className}</strong>
            <br />
            Students: {cls.studentsIds.length}
            <br />
            <Link to={`/teacher/class/${cls._id}/students`}>
              Manage Students
            </Link>
            {" | "}
            <Link to={`/teacher/class/${cls._id}/live`}>Start Live Class</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherDashboard;
