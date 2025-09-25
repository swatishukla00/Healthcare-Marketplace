import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiAnalyticsByCategory, apiProviderDashboard } from "../api";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const location = useLocation();
  const [provider, setProvider] = useState("");
  const [kpis, setKpis] = useState(null);
  const [breakdown, setBreakdown] = useState([]);

  const loadAll = async () => {
    const b = await apiAnalyticsByCategory();
    setBreakdown(b);
    if (provider) {
      const k = await apiProviderDashboard(provider);
      setKpis(k);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const p = params.get('provider') || "";
    if (p && !provider) setProvider(p);
    loadAll();
  }, [provider, location.search]);

  return (
    <div>
      <h3 className="mb-3">Provider Dashboard</h3>
      <div className="input-group mb-3">
        <input className="form-control" placeholder="Provider name for KPIs" value={provider} onChange={e => setProvider(e.target.value)} />
        <button className="btn btn-brand" onClick={loadAll}>Refresh</button>
      </div>
      {kpis && (
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <div className="card p-3"><div className="muted">Provider</div><div className="h5">{kpis.provider}</div></div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card p-3"><div className="muted">Total Revenue</div><div className="h3">₹{kpis.total_revenue}</div></div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card p-3"><div className="muted">Datasets Listed</div><div className="h3">{kpis.datasets_listed}</div></div>
          </div>
          <div className="col-12">
            <div className="card p-3"><div className="muted">Compliance</div><div className="h4">{kpis.compliance}%</div></div>
          </div>
        </div>
      )}
      <div className="card p-3">
        <h5 className="mb-3">Revenue by Category</h5>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg-6">
            <Doughnut
              data={{
                labels: breakdown.map(b => b.category),
                datasets: [{
                  data: breakdown.map(b => b.revenue),
                  backgroundColor: ['#00b3ff','#14b8a6','#60a5fa','#f59e0b','#ef4444','#a78bfa'],
                  borderWidth: 0,
                }]
              }}
              options={{
                plugins: { legend: { labels: { color: '#e2e8f0' } } },
                animation: { animateScale: true, animateRotate: true }
              }}
            />
          </div>
          <div className="col-12 col-lg-6">
            <Bar
              data={{
                labels: breakdown.map(b => b.category),
                datasets: [{
                  label: 'Datasets',
                  data: breakdown.map(b => b.count),
                  backgroundColor: '#0077ff'
                }]
              }}
              options={{
                plugins: { legend: { labels: { color: '#e2e8f0' } } },
                scales: {
                  x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
                  y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } }
                },
                animation: { duration: 700 }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


