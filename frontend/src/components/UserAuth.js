import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin, apiSignup } from "../api";

function UserAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("provider");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(true);
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const navigate = useNavigate();

  const passwordScore = useMemo(() => {
    const pwd = password || "";
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
    return Math.min(score, 4); // 0..4
  }, [password]);

  const strengthLabel = ["Weak", "Weak", "Medium", "Strong", "Strong"][passwordScore] || "Weak";
  const strengthColor = ["#ef4444", "#ef4444", "#f59e0b", "#22c55e", "#22c55e"][passwordScore] || "#ef4444";

  const handleSignup = async () => {
    try {
      const fieldErrors = {};
      if (!username) fieldErrors.username = "Username is required";
      if (!password) fieldErrors.password = "Password is required";
      if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
      // client-side minimum requirements
      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecial = /[^a-zA-Z0-9]/.test(password);
      if (!(password.length >= 8 && hasLower && hasUpper && hasDigit && hasSpecial)) {
        setErrors({ password: "Use 8+ chars incl. uppercase, lowercase, number, and symbol" });
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
      const fieldErrors = {};
      if (!username) fieldErrors.username = "Username is required";
      if (!password) fieldErrors.password = "Password is required";
      if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
      const res = await apiLogin({ username, password });
      setMessage(res.status || "Logged in");
      if (remember) {
        localStorage.setItem('user', JSON.stringify({ username, role: res.role, id: res.user_id }));
      } else {
        sessionStorage.setItem('user', JSON.stringify({ username, role: res.role, id: res.user_id }));
      }
      navigate("/catalog");
    } catch (e) {
      setMessage(e?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card p-4" role="form" aria-labelledby="authTitle">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 id="authTitle" className="mb-0 gradient-title">Welcome</h3>
          </div>

          <div className="btn-group mb-3" role="tablist" aria-label="Authentication mode">
            <button type="button" className={`btn btn-outline-light ${mode==='login' ? 'active' : ''}`} onClick={()=>setMode('login')} aria-pressed={mode==='login'}>Log In</button>
            <button type="button" className={`btn btn-outline-light ${mode==='signup' ? 'active' : ''}`} onClick={()=>setMode('signup')} aria-pressed={mode==='signup'}>Sign Up</button>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="username">Username or Email</label>
            <input
              id="username"
              className="form-control glass-input"
              placeholder="you@example.com"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setErrors((er) => ({ ...er, username: undefined })); }}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
            {errors.username && (<div id="username-error" className="text-danger mt-1" role="alert">{errors.username}</div>)}
          </div>

          <div className="mb-2">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-group">
              <span className="input-group-text" aria-hidden="true">🔒</span>
              <input
                id="password"
                className="form-control glass-input"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((er) => ({ ...er, password: undefined })); }}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : 'password-help'}
              />
              <button
                className="btn btn-outline-light"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >{showPassword ? '🙈' : '👁️'}</button>
            </div>
            {errors.password && (<div id="password-error" className="text-danger mt-1" role="alert">{errors.password}</div>)}
            {!errors.password && (
              <div id="password-help" className="mt-2">
                <div className="strength-track" aria-label="Password strength" aria-valuemin={0} aria-valuemax={4} aria-valuenow={passwordScore} role="progressbar">
                  <div className="strength-bar" style={{ width: `${(passwordScore/4)*100}%`, background: strengthColor }} />
                </div>
                <small style={{ color: strengthColor }}>{strengthLabel} • Use 8+ chars with uppercase, number, and symbol</small>
              </div>
            )}
          </div>

          {mode === 'signup' && (
            <div className="mb-3">
              <label className="form-label" htmlFor="role">Role</label>
              <div className="input-group">
                <span className="input-group-text" aria-hidden="true">🛡️</span>
                <select id="role" className="form-select glass-input" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="provider">🏥 Provider</option>
                  <option value="researcher">🧪 Researcher</option>
                  <option value="pharma">💊 Pharma</option>
                  <option value="admin">🛠️ Admin</option>
                  <option value="user">👤 User</option>
                </select>
              </div>
            </div>
          )}

          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <label className="form-check-label" htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="muted" onClick={(e) => e.preventDefault()} aria-label="Forgot Password">Forgot Password?</a>
          </div>

          <div className="d-flex">
            {mode === 'signup' ? (
              <button className="btn btn-brand hover-glow click-bounce" onClick={handleSignup} aria-label="Sign Up">Sign Up</button>
            ) : (
              <button className="btn btn-brand hover-glow click-bounce" onClick={handleLogin} aria-label="Log In">Log In</button>
            )}
          </div>

          <div className="text-center mt-3">
            {message && <p className="muted" role="status">{message}</p>}
          </div>

          <div className="mt-3 d-grid gap-2">
            <button className="btn btn-outline-light" aria-label="Continue with Google">Continue with Google ⚪</button>
            <button className="btn btn-outline-light" aria-label="Continue with GitHub">Continue with GitHub ⚫</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;
