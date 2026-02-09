import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";

const AttendanceHistory = () => {
  const { classId } = useParams();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get(`/attendance/class/${classId}`).then((res) => {
      setRecords(res.data.data);
    });
  }, []);

  return (
    <div>
      <h2>Attendance History</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.studentId.name}</td>
              <td>{r.studentId.email}</td>
              <td>
                {r.status === "present" ? "🟢 Present" : "🔴 Absent"}
              </td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceHistory;
