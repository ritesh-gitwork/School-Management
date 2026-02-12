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

import StudentDashboard from "./pages/student/Dashboard";
import StudentLiveClass from "./pages/student/LiveClass";
import AttendanceHistoryforSTD from "./pages/student/AttendanceHistoryforSTD";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* default redirect */}
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}

          {/* auth routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />

          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/class/:classId/live"
            element={
              <ProtectedRoute role="teacher">
                <LiveClass />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/class/:classId/attendance"
            element={
              <ProtectedRoute role="teacher">
                <AttendanceHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/class/:classId/students"
            element={
              <ProtectedRoute role="teacher">
                <AddStudent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/class/:classId/live"
            element={
              <ProtectedRoute role="student">
                <StudentLiveClass />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute role="student">
                <AttendanceHistoryforSTD />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
