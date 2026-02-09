import { useEffect, useState } from "react";
import api from "../../api/axios";

const AttendanceHistoryforSTD = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get("/attendance/me").then((res) => {
      setRecords(res.data.data);
    });
  }, []);

  return (
    <div>
      <h2>My Attendance</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Class</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.classId.className}</td>
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

export default AttendanceHistoryforSTD;
