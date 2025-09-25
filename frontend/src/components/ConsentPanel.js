import React, { useState } from "react";
import { apiCreateConsent, apiListConsents, apiUpdateConsent } from "../api";

function ConsentPanel() {
  const [userId, setUserId] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [consents, setConsents] = useState([]);
  const [message, setMessage] = useState("");

  const loadConsents = async () => {
    if (!userId || isNaN(Number(userId))) { setMessage('Enter a numeric User ID'); return; }
    const list = await apiListConsents(Number(userId));
    setConsents(list);
  };

  const createConsent = async () => {
    try {
      if (!userId || !datasetId) { setMessage('Enter User ID and Dataset ID'); return; }
      if (isNaN(Number(userId)) || isNaN(Number(datasetId))) { setMessage('IDs must be numeric'); return; }
      const res = await apiCreateConsent({ user_id: Number(userId), dataset_id: Number(datasetId), status: "granted" });
      setMessage(res.status || "Consent created");
      await loadConsents();
    } catch (e) {
      setMessage(e?.response?.data?.error || "Action failed");
    }
  };

  const toggleConsent = async (c) => {
    const newStatus = c.status === "granted" ? "revoked" : "granted";
    await apiUpdateConsent(c.id, newStatus);
    await loadConsents();
  };

  return (
    <div className="row">
      <div className="col-12 col-lg-4">
        <div className="card p-3 mb-3">
          <h4>Consent Controls</h4>
          <div className="mb-2">
            <label className="form-label">User ID</label>
            <input className="form-control glass-input" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
          </div>
          <div className="mb-2 d-flex">
            <button className="btn btn-brand" onClick={loadConsents}>Load Consents</button>
          </div>
          <div className="mb-2">
            <label className="form-label">Dataset ID</label>
            <input className="form-control glass-input" placeholder="Dataset ID" value={datasetId} onChange={e => setDatasetId(e.target.value)} />
          </div>
          <button className="btn btn-outline-light" onClick={createConsent}>Grant Consent</button>
          <p className="muted mt-2">{message}</p>
          <div className="small muted">Tip: Enter your numeric User ID and a Dataset ID, then click Grant Consent to create a new consent record. Use Toggle to switch granted/revoked.</div>
        </div>
      </div>
      <div className="col-12 col-lg-8">
        <div className="row g-3">
          {consents.map(c => (
            <div className="col-12 col-md-6" key={c.id}>
              <div className="card p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small muted">Consent #{c.id}</div>
                    <div>Dataset: {c.dataset_id}</div>
                  </div>
                  <div>
                    <span className={`badge ${c.status === 'granted' ? 'bg-success' : 'bg-secondary'}`}>{c.status}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <button className="btn btn-sm btn-outline-light me-3" onClick={() => toggleConsent(c)}>Toggle</button>
                  <input
                    type="checkbox"
                    className={`consent-toggle ${c.status === 'granted' ? 'consent-on' : 'consent-off'}`}
                    onChange={() => toggleConsent(c)}
                    checked={c.status === 'granted'}
                    readOnly
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConsentPanel;


