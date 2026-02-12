import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();  // ✅ Correct usage
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on login & signup pages
  // if (location.pathname === "/login" || location.pathname === "/auth/signup") {
  //   return null;
  // }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0US-NQdl5rHZ6hKdGy3QIZ-TCkmb-_gipww&s"
          alt="School Logo"
          style={styles.logo}
        />
        <h2 style={styles.title}><b>Doon International School</b></h2>
      </div>

      <div style={styles.rightSection}>
        {!user ? (
          <button
            style={styles.loginButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <>
            <button
              style={styles.dashboardButton}
              onClick={() =>
                navigate(
                  user.role === "teacher"
                    ? "/teacher/dashboard"
                    : "/student/dashboard"
                )
              }
            >
              Dashboard
            </button>

            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 40px",
    backgroundColor: "#1e3a8a",
    color: "white",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logo: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
  },
  title: {
    margin: 0,
    fontWeight: "900",
  },
  rightSection: {
    display: "flex",
    gap: "12px",
  },
  loginButton: {
    padding: "8px 18px",
    backgroundColor: "white",
    color: "#1e3a8a",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  dashboardButton: {
    padding: "8px 18px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "8px 18px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Navbar;
