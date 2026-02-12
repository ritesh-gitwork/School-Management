import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.textSection}>
          <h1>Welcome to Attendance Management System</h1>
          <p>
            A modern platform to manage classroom attendance efficiently.
            Track students, manage live classes, and monitor attendance history
            with ease.
          </p>

          <button
            style={styles.button}
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>

        <div>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTWJuFNBzygE_-mXo4t7T33bpJj1HecMli4g&s"
            alt="Attendance Illustration"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "60px",
    // backgroundColor:"#636c81ff"
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "40px",
  },
  textSection: {
    maxWidth: "500px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  image: {
    width: "400px",
  },
};

export default Landing;
