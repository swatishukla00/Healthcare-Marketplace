import React, { useState } from "react";
import { apiUploadDataset, apiStandardize } from "../api";

function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [format, setFormat] = useState("FHIR");
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [previewFHIR, setPreviewFHIR] = useState(null);

  const handleUpload = async () => {
    try {
      const res = await apiUploadDataset({ title, description, provider, price: Number(price), category, format });
      setMessage(res.status || "Uploaded");
    } catch (e) {
      setMessage(e?.response?.data?.error || "Upload failed");
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      // demo: parse simple JSON patient and standardize
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      const text = await file.text();
      const patient = JSON.parse(text);
      const fhir = await apiStandardize(patient);
      setPreviewFHIR(fhir);
    } catch (err) {
      setMessage("Could not standardize file. Ensure JSON patient format.");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8">
        <div className="card p-4">
          <h3 className="mb-3">List New Dataset</h3>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Title</label>
              <input className="form-control" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Provider</label>
              <input className="form-control" placeholder="Provider" value={provider} onChange={e => setProvider(e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label">Price (INR)</label>
              <input className="form-control" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label">Category</label>
              <input className="form-control" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Format</label>
              <select className="form-select" value={format} onChange={e => setFormat(e.target.value)}>
                <option value="FHIR">FHIR</option>
                <option value="CSV">CSV</option>
                <option value="JSON">JSON</option>
              </select>
            </div>
          </div>
          <div className="mt-3 d-flex">
            <button className="btn btn-brand" onClick={handleUpload}>Submit</button>
            <p className="muted ms-3 mb-0 align-self-center">{message}</p>
          </div>
          <div className={`mt-4 p-4 border rounded dropzone-ripple ${dragOver ? 'dragover' : ''}`}
               onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
               onDragLeave={() => setDragOver(false)}
               onDrop={onDrop}>
            <div className="muted">Drag & drop a JSON Patient to preview FHIR conversion</div>
            {previewFHIR && (
              <>
                <div className="checkmark" />
                <pre className="mt-3" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(previewFHIR, null, 2)}</pre>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;


