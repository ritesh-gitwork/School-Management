import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (location.state?.signupSuccess) {
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (!token || !user) {
        alert("Invalid login response");
        return;
      }

      login(token, user);

      if (user.role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      {showMessage && (
        <div className="toast-success">Signup Successful. Please Login</div>
      )}
      <div className="login-card">
        <h2>Sign in</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign in</button>
        </form>

        <p className="signup-link" onClick={() => navigate("/auth/signup")}>
          Sign Up
        </p>
      </div>
    </div>
  );
};

export default Login;
