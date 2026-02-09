import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const AddStudent = () => {
  const { classId } = useParams();
  const [studentId, setStudentId] = useState("");
  const [students, setStudents] = useState([]);

  const fetchClass = async () => {
    const res = await api.get(`/class/${classId}`);
    setStudents(res.data.data.studentsIds);
  };

  useEffect(() => {
    fetchClass();
  }, []);

  const addStudent = async () => {
    try {
      await api.post("/class/add-student", {
        classId,
        studentId,
      });

      setStudentId("");
      fetchClass();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add student");
    }
  };

  return (
    <div>
      <h2>Add Student</h2>

      <input
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <button onClick={addStudent}>Add Student</button>

      <h3>Students in Class</h3>
      <ul>
        {students.map((s) => (
          <li key={s._id}>
            {s.name} ({s.email})
          </li>
        ))}
      </ul>
    </div>
  );
};


export default AddStudent;
