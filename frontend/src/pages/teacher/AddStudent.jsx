import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const AddStudent = () => {
  const { classId } = useParams();

  const [students, setStudents] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [requests,setRequest] = useState([])

  // fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await api.get("/user/students");
      setStudents(res.data.data);
    };

    fetchStudents();
  }, []);

  // Fetch students already in class
  useEffect(() => {
    const fetchClassStudents = async () => {
      const res = await api.get(`/class/${classId}`);
      setClassStudents(res.data.data.studentsIds);
    };

    fetchClassStudents();
  }, [classId]);

  const handleAddStudent = async (studentId) => {
    try {
      await api.post("/class/add-student", {
        classId,
        studentId,
      });

      alert("Student added successfully");

      // refresh class students
      const res = await api.get(`/class/${classId}`);
      setClassStudents(res.data.data.studentsIds);

    } catch (error) {
      alert(error.response?.data?.error || "Failed to add");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Students</h2>

      <table width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => {
            const alreadyAdded = classStudents.some(
              (s) => s._id === student._id
            );

            return (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  {alreadyAdded ? (
                    <span style={{ color: "green" }}>Added</span>
                  ) : (
                    <button
                      onClick={() => handleAddStudent(student._id)}
                    >
                      Add
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AddStudent;
