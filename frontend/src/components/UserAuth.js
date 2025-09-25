import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin, apiSignup } from "../api";

function UserAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("provider");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // basic client-side password strength
      const strong = (pwd) => {
        if (!pwd || pwd.length < 8) return false;
        const hasLower = /[a-z]/.test(pwd);
        const hasUpper = /[A-Z]/.test(pwd);
        const hasDigit = /\d/.test(pwd);
        const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
        const common = new Set(["password","Password123","12345678","qwerty123","admin123","welcome1"]);
        return hasLower && hasUpper && hasDigit && hasSpecial && !common.has(pwd);
      };
      if (!strong(password)) {
        setMessage("Strong password required: 8+ chars, upper, lower, number, special");
        return;
      }
      const res = await apiSignup({ username, password, role });
      setMessage(res.status || "Signed up");
    } catch (e) {
      setMessage(e?.response?.data?.error || "Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      if (!username || !password) { setMessage("Enter username and password"); return; }
      const res = await apiLogin({ username, password });
      setMessage(res.status || "Logged in");
      localStorage.setItem('user', JSON.stringify({ username, role: res.role, id: res.user_id }));
      navigate("/catalog");
    } catch (e) {
      setMessage(e?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card p-4">
          <h3 className="mb-3">User Authentication</h3>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
              <option value="provider">Provider</option>
              <option value="researcher">Researcher</option>
              <option value="pharma">Pharma</option>
            </select>
          </div>
          <div className="d-flex">
            <button className="btn btn-brand" onClick={handleSignup}>Sign Up</button>
            <button className="btn btn-outline-light ms-2" onClick={handleLogin}>Log In</button>
          </div>
          <p className="muted mt-3">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;
