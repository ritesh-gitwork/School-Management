import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const AttendanceHistory = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        if (classId) {
          // 🔹 Detailed class view
          const res = await api.get(`/attendance/class/${classId}`);
          setData(res.data.data || []);
        } else {
          // 🔹 Teacher overview
          const res = await api.get("/attendance/teacher-overview");
          setData(res.data.data || []);
        }
      } catch (err) {
        console.error("Attendance fetch error:", err);
        setError("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading attendance...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  // 🔹 ================= OVERVIEW =================
  if (!classId) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Attendance Overview</h2>

        {data.length === 0 ? (
          <p>No attendance records yet.</p>
        ) : (
          <table width="100%" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Class</th>
                <th>Total Sessions</th>
                <th>Present %</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.classId}>
                  <td>{item.className}</td>
                  <td>{item.totalSessions}</td>
                  <td>{item.percentage}%</td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(`/teacher/class/${item.classId}/attendance`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // 🔹 ================= CLASS DETAILS =================
  return (
    <div style={{ padding: 20 }}>
      <h2>Class Attendance Details</h2>

      <button onClick={() => navigate("/teacher/attendance")}>⬅ Back</button>

      {data.length === 0 ? (
        <p>No attendance records found for this class.</p>
      ) : (
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Student</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((record) => (
              <tr key={record._id ?? record.studentId?._id}>
                <td>{record.studentId?.name || "Unknown"}</td>
                <td>{record.status}</td>
                <td>
                  {record.createdAt
                    ? new Date(record.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceHistory;
