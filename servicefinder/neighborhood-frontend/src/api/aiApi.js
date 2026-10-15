import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const smartSearch = (q, limit = 10) =>
  api.get("/api/services/smart-search", { params: { q, limit } }).then((r) => r.data);

export const getMyInsights = () =>
  api.get("/api/reviews/provider/insights").then((r) => r.data);

export const approveReview = (id) =>
  api.put(`/api/reviews/admin/${id}/approve`).then((r) => r.data);

export const getAnalytics = () =>
  api.get("/api/admin/analytics").then((r) => r.data);