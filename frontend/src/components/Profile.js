import React from "react";

function Profile() {
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; } })();
  const initials = user?.username ? user.username.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase() : 'SS';
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card p-4">
          <div className="d-flex align-items-center mb-3">
            <span className="avatar me-3" style={{ width: 56, height: 56, fontSize: 20 }}>{initials}</span>
            <div>
              <div className="h5 mb-0">{user.username || 'Guest'}</div>
              <div className="muted">Role: {user.role || 'N/A'}</div>
            </div>
          </div>
          <div className="muted">User profile info can be expanded here.</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;


