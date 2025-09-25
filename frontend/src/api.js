import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export async function apiSignup(payload) {
  const res = await axios.post(`${API_BASE}/signup`, payload);
  return res.data;
}

export async function apiLogin(payload) {
  const res = await axios.post(`${API_BASE}/login`, payload);
  return res.data;
}

export async function apiListDatasets(params) {
  const res = await axios.get(`${API_BASE}/datasets`, { params });
  return res.data.datasets;
}

export async function apiUploadDataset(payload) {
  const res = await axios.post(`${API_BASE}/upload`, payload);
  return res.data;
}

export async function apiCreateConsent(payload) {
  const res = await axios.post(`${API_BASE}/consents`, payload);
  return res.data;
}

export async function apiListConsents(userId) {
  const res = await axios.get(`${API_BASE}/consents/${userId}`);
  return res.data.consents;
}

export async function apiUpdateConsent(consentId, status) {
  const res = await axios.patch(`${API_BASE}/consents/${consentId}`, { status });
  return res.data;
}

export async function apiRevenue(provider) {
  const res = await axios.get(`${API_BASE}/analytics/revenue/${encodeURIComponent(provider)}`);
  return res.data;
}

export async function apiProviders(params) {
  const res = await axios.get(`${API_BASE}/providers`, { params });
  return res.data.providers;
}

export async function apiStandardize(patient) {
  const res = await axios.post(`${API_BASE}/standardize`, patient);
  return res.data.fhir;
}

export async function apiAnalyticsByCategory() {
  const res = await axios.get(`${API_BASE}/analytics/by_category`);
  return res.data.breakdown;
}

export async function apiProviderDashboard(provider) {
  const res = await axios.get(`${API_BASE}/dashboard/${encodeURIComponent(provider)}`);
  return res.data;
}
