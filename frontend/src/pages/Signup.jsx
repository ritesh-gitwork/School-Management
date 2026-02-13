import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css"

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await api.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });

      navigate("/login",{
        state:{signupSuccess:true},
      })
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Signup</h2>

        <form onSubmit={handleSignup}>


        <input type="name" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        

        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button type="submit">Signup</button>
          </form>
      </div>
    </div>
  );
};

export default Signup;
