import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

// console.log("AddStudent page loaded", classId);


const AddStudent = () => {
  const { classId } = useParams();

  const [students, setStudents] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [requests, setRequests] = useState([]);

  // ==============================
  // Fetch All Students
  // ==============================
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/user/students");
      setStudents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch students");
    }
  };

  // ==============================
  // Fetch Class Students
  // ==============================
  useEffect(() => {
    fetchClassStudents();
    fetchRequests();
  }, [classId]);

  const fetchClassStudents = async () => {
    try {
      const res = await api.get(`/class/${classId}`);
      setClassStudents(res.data.data.studentsIds);
    } catch (err) {
      console.error("Failed to fetch class students");
    }
  };

  // ==============================
  // Fetch Join Requests
  // ==============================
  const fetchRequests = async () => {
    try {
      const res = await api.get(`/join/class/${classId}`);
      setRequests(res.data.data);
    } catch (err) {
      console.error("Failed to fetch requests");
    }
  };

  // ==============================
  // Manual Add Student
  // ==============================
  const handleAddStudent = async (studentId) => {
    try {
      await api.post("/class/add-student", {
        classId,
        studentId,
      });

      alert("Student added successfully");
      fetchClassStudents();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add");
    }
  };

  // ==============================
  // Accept / Reject Request
  // ==============================
  const handleRequest = async (requestId, action) => {
    try {
      await api.post("/join/handle", {
        requestId,
        action,
      });

      fetchRequests();
      fetchClassStudents();
    } catch (error) {
      alert("Failed to update request");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Students</h2>

      {/* ============================= */}
      {/* Approval Requests Section */}
      {/* ============================= */}
      <h3>Approval Requests</h3>

      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 && (
            <tr>
              <td colSpan="3">No pending requests</td>
            </tr>
          )}

          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.studentId.name}</td>
              <td>{req.studentId.email}</td>
              <td>
                <button
                  onClick={() => handleRequest(req._id, "accepted")}
                  style={{ marginRight: 10 }}
                >
                  Accept
                </button>

                <button
                  onClick={() => handleRequest(req._id, "rejected")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ margin: "30px 0" }} />

      {/* ============================= */}
      {/* Manual Add Section */}
      {/* ============================= */}
      <h3>All Students</h3>

      <table width="100%" border="1" cellPadding="8">
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
