import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import UserAuth from "./components/UserAuth";
import Catalog from "./components/Catalog";
import Upload from "./components/Upload";
import ConsentPanel from "./components/ConsentPanel";
import RevenueAnalytics from "./components/RevenueAnalytics";
import Providers from "./components/Providers";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Settings from "./components/Settings";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <span className="icon-badge me-2" aria-hidden>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l7 4v6c0 5-7 10-7 10S5 17 5 12V6l7-4z"/></svg>
            </span>
            <span style={{ fontFamily: 'Poppins, Inter', fontWeight: 600 }}>Healthcare Data Marketplace</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active-pill' : ''}`} to="/catalog">Catalog</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active-pill' : ''}`} to="/providers">Providers</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active-pill' : ''}`} to="/upload">Upload</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active-pill' : ''}`} to="/consents">Consents</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active-pill' : ''}`} to="/revenue">Revenue</NavLink></li>
              <li className="nav-item"><NavLink className={({isActive}) => `nav-link ${isActive ? 'active-pill' : ''}`} to="/dashboard">Dashboard</NavLink></li>
            </ul>
            <UserMenu />
          </div>
        </div>
      </nav>
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<UserAuth />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/consents" element={<ConsentPanel />} />
          <Route path="/revenue" element={<RevenueAnalytics />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </Router>
  );
}

function UserMenu() {
  const navigate = useNavigate();
  const getUser = () => {
    try {
      const l = JSON.parse(localStorage.getItem('user') || 'null');
      const s = JSON.parse(sessionStorage.getItem('user') || 'null');
      return l || s;
    } catch {
      return null;
    }
  };
  const user = getUser();
  const initials = user?.username ? user.username.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase() : null;
  const handleNav = (path) => { navigate(path); };
  const handleLogout = () => { localStorage.removeItem('user'); sessionStorage.removeItem('user'); navigate('/'); };
  if (!user) {
    return (
      <div className="d-flex align-items-center">
        <button className="btn btn-outline-light" onClick={() => navigate('/')}>Log In</button>
      </div>
    );
  }
  return (
    <div className="d-flex align-items-center">
      <div className="seal me-3" title="Blockchain security active"></div>
      <div className="dropdown">
        <button className="btn btn-sm dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false" style={{ background: 'transparent', border: 'none', color: '#e2e8f0' }}>
          <span className="avatar">{initials}</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><button className="dropdown-item" onClick={() => handleNav('/profile')}>Profile</button></li>
          <li><button className="dropdown-item" onClick={() => handleNav('/settings')}>Settings</button></li>
          <li><hr className="dropdown-divider" /></li>
          <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
    </div>
  );
}

export default App;
