import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });


      const { token, user } = res.data;

      // 🔴 SAFETY CHECK
      if (!token || !user) {
        alert("Invalid login response");
        return;
      }

      // ✅ save auth
      login(token, user);

      // ✅ redirect (ABSOLUTE PATH)
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
    <div style={{display:"flex",flexDirection:"column",padding:"40px",boxSizing:"border-box"}}>
      <h2>Sign in</h2>

      <input style={{padding:"5px",marginBottom:"10px"}}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input style={{padding:"5px",marginBottom:"10px"}}
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
