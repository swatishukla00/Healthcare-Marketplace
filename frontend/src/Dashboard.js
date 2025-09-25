import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const resMetrics = await axios.get("http://localhost:5000/metrics");
        setMetrics(resMetrics.data);

        const resRevenue = await axios.get("http://localhost:5000/revenue");
        setRevenue(resRevenue.data);
      } catch {
        alert("Failed to load dashboard data");
      }
    }
    fetchData();
  }, []);

  if (!metrics || !revenue) return <p>Loading...</p>;

  return (
    <div>
      <h3>Provider Dashboard</h3>
      <p>Total Contributions: {metrics.total_contributions}</p>
      <p>Total Consents: {metrics.total_consents}</p>
      <p>Total Revenue: ${metrics.revenue}</p>

      <h4>Monthly Revenue</h4>
      <ul>
        {revenue.monthly_revenue.map((val, i) => (
          <li key={i}>{`Month ${i + 1}: $${val}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
