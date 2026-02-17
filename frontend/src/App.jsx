import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Navbar from "./component/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

//page of teacher
import TeacherDashboard from "./pages/teacher/Dashboard";
import AddStudent from "./pages/teacher/AddStudent";
import LiveClass from "./pages/teacher/LiveClass";
import AttendanceHistory from "./pages/teacher/AttendanceHistory";
import TeacherLayout from "./layouts/TeacherLayout";

import StudentDashboard from "./pages/student/Dashboard";
import StudentLiveClass from "./pages/student/LiveClass";
import AttendanceHistoryforSTD from "./pages/student/AttendanceHistoryforSTD";
import StudentLayout from "./layouts/StudentLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* auth routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />

          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            {/* <Route index element={<Navigate to="dashboard" />} /> */}
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="class/:classId/live" element={<LiveClass />} />
            <Route
              path="class/:classId/attendance"
              element={<AttendanceHistory />}
            />
            <Route path="class/:classId" element={<AddStudent />} />
          </Route>

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard">
              <Route index element={<Navigate to="classes" />} />
              <Route path="classes" element={<StudentDashboard />} />
              <Route path="attendance" element={<StudentDashboard />} />
            </Route>

            <Route path="class/:classId/live" element={<StudentLiveClass />} />
            <Route path="attendance" element={<AttendanceHistoryforSTD />} />
          </Route>

          {/* fallback ka route  */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
