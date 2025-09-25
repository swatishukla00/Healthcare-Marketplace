import React, { useEffect, useMemo, useState } from "react";
import { apiRevenue, apiProviders } from "../api";

function RevenueAnalytics() {
  const [provider, setProvider] = useState("");
  const [result, setResult] = useState(null);
  const [allProviders, setAllProviders] = useState([]);
  const suggestions = useMemo(() => {
    if (!provider) return [];
    const q = provider.toLowerCase();
    return allProviders.filter(p => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [provider, allProviders]);

  const fetchRevenue = async () => {
    if (!provider) return;
    const data = await apiRevenue(provider);
    setResult(data);
  };

  useEffect(() => {
    (async () => {
      try {
        const list = await apiProviders();
        setAllProviders(list);
      } catch {}
    })();
  }, []);

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8">
      <div className="card p-4 position-relative">
          <h3 className="mb-3">Revenue Analytics</h3>
          <div className="input-group">
            <input className="form-control" placeholder="Provider name" value={provider} onChange={e => setProvider(e.target.value)} />
            <button className="btn btn-brand" onClick={fetchRevenue}>Fetch</button>
          </div>
          {suggestions.length > 0 && (
            <div className="list-group position-absolute w-100 mt-1" style={{ maxWidth: '520px', zIndex: 10 }}>
              {suggestions.map(s => (
                <button key={s.id} className="list-group-item list-group-item-action" onClick={() => setProvider(s.name)}>
                  {s.name} <span className="small text-muted">{s.type} • {s.location}</span>
                </button>
              ))}
            </div>
          )}
          {result && (
            <div className="mt-3">
              <div><strong>Provider:</strong> {result.provider}</div>
              <div><strong>Total Revenue:</strong> ₹{result.total_revenue}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevenueAnalytics;


