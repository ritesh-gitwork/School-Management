import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [requests, setRequests] = useState([]);

  const location = useLocation();

  const activeTab = location.pathname.includes("attendance")
    ? "attendance"
    : "classes";

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await api.get("/attendance/my");
      setAttendanceData(res.data.data);
    };

    fetchAttendance();
  }, []);

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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/join/my");
        setRequests(res.data.data);
      } catch (error) {
        console.log("failed to fetch request");
      }
    };
    fetchRequests();
  }, []);

  const requestJoin = async (classId) => {
    try {
      await api.post("/join/join", { classId });
      alert("Request Send");

      const res =await api.get("/join/my")
      setRequests(res.data.data) 
    } catch (error) {
      alert("Already Requested");
    }
  };

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
            <button>Classes</button>
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
                  <th>Request</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {classes.map((cls) => {
                  const request = requests.find(
                    (r) => r.classId._id === cls._id,
                  );

                  return (
                    <tr key={cls._id}>
                      <td>{cls.className}</td>

                      <td>
                        {!request && (
                          <button
                            onClick={() => requestJoin(cls._id)}
                            className="table-btn"
                          >
                            Request
                          </button>
                        )}
                      </td>

                      <td>{request ? request.status : "Not Requested"}</td>
                    </tr>
                  );
                })}
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
                {classes.map((cls) => {
                  const attendance = attendanceData.find(
                    (item) => item.className === cls.className,
                  );

                  return (
                    <tr key={cls._id}>
                      <td>{cls.className}</td>
                      <td>{attendance ? `${attendance.percentage}%` : "0%"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
