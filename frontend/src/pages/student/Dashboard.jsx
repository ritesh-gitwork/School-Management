import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  // const [activeTab, setActiveTab] = useState("classes");

  const location = useLocation();

  const activeTab = location.pathname.includes("attendance")
    ? "attendance"
    : "classes";

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/class/getclass");
        setClasses(res.data.data);
      } catch (err) {
        console.error("Failed to load classes");
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="student-container">
      {/* Top Section */}
      <div className="top-row">
        <div className="welcome-box">Welcome {user?.name}</div>

        <button className="join-class-btn">Join Class</button>
      </div>

      {/* Main Card */}
      <div className="main-card">
        {/* Tabs */}
        <div className="tabs">
          <Link
            to="/student/dashboard/classes"
            className={activeTab === "classes" ? "active" : ""}
          >
            <button >Classes</button>
          </Link>

          <Link
            to="/student/dashboard/attendance"
            className={activeTab === "attendance" ? "active" : ""}
          >
            <button className={activeTab === "attendance" ? "active" : ""}>
              Attendance
            </button>
          </Link>
        </div>

        {/* Table Content */}
        <div className="table-area">
          {activeTab === "classes" && (
            <table>
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Join</th>
                </tr>
              </thead>

              <tbody>
                {classes.map((cls) => (
                  <tr key={cls._id}>
                    <td>{cls.className}</td>
                    <td>
                      <Link
                        to={`/student/class/${cls._id}/live`}
                        className="table-btn"
                      >
                        Join
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "attendance" && (
            <table>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Attendance %</th>
                </tr>
              </thead>

              <tbody>
                {classes.map((cls) => (
                  <tr key={cls._id}>
                    <td>{cls.className}</td>
                    <td>--%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
