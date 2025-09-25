import React, { useEffect, useState } from "react";
import { apiProviders } from "../api";
import { useNavigate } from "react-router-dom";

function Providers() {
  const [q, setQ] = useState("");
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(async () => {
      try {
        const list = await apiProviders(q ? { q } : undefined);
        setProviders(list);
      } catch (e) {
        setProviders([]);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [q]);

  return (
    <div>
      <h3 className="mb-3">Providers</h3>
      <div className="input-group mb-3">
        <input className="form-control" placeholder="Search providers by name, type, location" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="row g-3">
        {providers.map(p => (
          <div className="col-12 col-md-6 col-lg-4" key={p.id}>
            <div
              className="card p-3 hover-glow click-bounce cursor-pointer d-flex align-items-center"
              role="button"
              onClick={() => window.open(`/catalog?provider=${encodeURIComponent(p.name)}`, '_blank')}
            >
              <span className="icon-badge" aria-hidden>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
              </span>
              <div>
                <h5 className="mb-1">{p.name}</h5>
                <div className="small muted">{p.type} • {p.location}</div>
              </div>
            </div>
          </div>
        ))}
        {providers.length === 0 && (
          <div className="col-12">
            <div className="card p-4 text-center">
              <div className="muted">No providers found. Try a different search.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Providers;


