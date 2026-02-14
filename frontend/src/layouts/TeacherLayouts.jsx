import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

import "../App.css";

const TeacherLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/teacher/dashboard" },
    { label: "Add Student", path: "/teacher/add-student" },
    { label: "Create Class", path: "/teacher/create-class" },
    { label: "Attendance History", path: "/teacher/attendance" },
  ];

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

        {/* Menu */}
        <div className="menu">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {!collapsed && item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default TeacherLayout;
