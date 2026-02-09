import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const StudentDashboard = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api.get("/class/getclass").then((res) => {
      setClasses(res.data.data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Dashboard</h2>

      <ul>
        {classes.map((cls) => (
          <li key={cls._id}>
            <strong>{cls.className}</strong>
            <br />
            <Link to={`/student/class/${cls._id}/live`}>
              Join Live Class
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDashboard;
