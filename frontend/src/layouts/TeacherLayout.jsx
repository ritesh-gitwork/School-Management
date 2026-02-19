import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import "../App.css";

const TeacherLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="teacher-layout">
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!collapsed && <h3>Teacher</h3>}
          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FiMenu size={22} /> : <FiX size={22} />}
          </button>
        </div>

        {/* Dashboard */}
        {/* <div
          className={`menu-item ${
            location.pathname === "/teacher/dashboard" ? "active" : ""
          }`}
          onClick={() => navigate("/teacher/dashboard")}
        >
          {!collapsed && "Dashboard"}
        </div> */}

        {/* Classes */}
        <div
          className={`menu-item ${
            location.pathname.includes("/teacher/dashboard") ? "active" : ""
          }`}
          onClick={() => navigate("/teacher/dashboard")}
        >
          {!collapsed && "Class Overview"}
        </div>

        {/* Attendance History */}
        <div
          className={`menu-item ${
            location.pathname.includes("/attendance") ? "active" : ""
          }`}
          onClick={() => navigate("/teacher/attendance")}
        >
          {!collapsed && "Attendance History"}
        </div>
      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default TeacherLayout;
