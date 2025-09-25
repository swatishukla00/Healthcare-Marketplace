import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiListDatasets } from "../api";
import "./Catalog.css";

function Catalog() {
  const [datasets, setDatasets] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const location = useLocation();

  useEffect(() => {
    async function fetchDatasets() {
      const params = new URLSearchParams(location.search);
      const provider = params.get('provider') || '';
      const list = await apiListDatasets({ q: search, category, provider });
      setDatasets(list);
    }
    fetchDatasets();
  }, [search, category, location.search]);

  return (
    <div className="catalog-container">
      <h2 className="mb-3 gradient-title">Marketplace Catalog</h2>
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-8">
          <input type="text" value={search} placeholder="Search datasets..." onChange={(e) => setSearch(e.target.value)} className="form-control glass-input" />
        </div>
        <div className="col-12 col-md-4">
          <input type="text" value={category} placeholder="Category" onChange={(e) => setCategory(e.target.value)} className="form-control glass-input" />
        </div>
      </div>
      <div className="row g-3">
        {datasets.map((ds) => (
          <div key={ds.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 p-3 hover-glow click-bounce">
              <div className="d-flex align-items-center mb-2">
                <span className="icon-badge" aria-hidden>
                  {/* Replace with specific icons per category. Placeholder links: */}
                  {/* Diabetes */}
                  {/* <img src="/icons/droplet.svg" alt="diabetes" /> */}
                  {/* Cardiology */}
                  {/* <img src="/icons/heart.svg" alt="cardiology" /> */}
                  {/* Oncology */}
                  {/* <img src="/icons/dna.svg" alt="oncology" /> */}
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v2H3V5zm2 4h14v10H5V9zm4 2v6h2v-6H9zm4 0v6h2v-6h-2z"/></svg>
                </span>
                <div className="d-flex justify-content-between align-items-start w-100">
                  <h5 className="mb-2">{ds.title}</h5>
                  <span className="price-pill">₹{ds.price}</span>
                </div>
              </div>
              <p className="muted">{ds.description}</p>
              <div className="small muted">
                <div><strong>Provider:</strong> {ds.provider}</div>
                <div><strong>Category:</strong> {ds.category} | <strong>Format:</strong> {ds.format}</div>
                <div><small>Listed: {new Date(ds.listing_date).toLocaleDateString()}</small></div>
              </div>
            </div>
          </div>
        ))}
        {datasets.length === 0 && (
          <div className="col-12">
            <div className="card p-4 text-center">
              <div className="muted">No datasets found. Try adjusting your search or category.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalog;
