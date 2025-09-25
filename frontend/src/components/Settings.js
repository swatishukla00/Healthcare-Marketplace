import React, { useState } from "react";

function Settings() {
  const stored = (() => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; } })();
  const [provider, setProvider] = useState(stored.username || '');
  const save = () => {
    const user = { ...(stored||{}), username: provider };
    localStorage.setItem('user', JSON.stringify(user));
    alert('Saved');
  };
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card p-4">
          <h4 className="mb-3">Settings</h4>
          <label className="form-label">Display Name</label>
          <input className="form-control glass-input" value={provider} onChange={e => setProvider(e.target.value)} />
          <button className="btn btn-brand mt-3" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;


