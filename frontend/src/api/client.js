import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach CSRF token from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// ─── Auth ────────────────────────

export async function fetchCsrf() {
  return api.get('/auth/csrf/');
}

export async function login(username, password) {
  const res = await api.post('/auth/login/', { username, password });
  return res.data;
}

export async function logout() {
  const res = await api.post('/auth/logout/');
  return res.data;
}

export async function fetchMe() {
  const res = await api.get('/auth/me/');
  return res.data;
}

export async function register(data) {
  const res = await api.post('/auth/register/', data);
  return res.data;
}

export async function resetPassword(email) {
  const res = await api.post('/auth/password-reset/', { email });
  return res.data;
}

// ─── Workshops ───────────────────

export async function fetchWorkshops() {
  const res = await api.get('/workshops/');
  return res.data;
}

export async function fetchWorkshopDetail(id) {
  const res = await api.get(`/workshops/${id}/`);
  return res.data;
}

export async function proposeWorkshop(data) {
  const res = await api.post('/workshops/propose/', data);
  return res.data;
}

export async function acceptWorkshop(id) {
  const res = await api.post(`/workshops/${id}/accept/`);
  return res.data;
}

export async function changeWorkshopDate(id, newDate) {
  const res = await api.post(`/workshops/${id}/change-date/`, { new_date: newDate });
  return res.data;
}

export async function addComment(workshopId, comment, isPublic) {
  const res = await api.post(`/workshops/${workshopId}/comments/`, {
    comment,
    public: isPublic,
  });
  return res.data;
}

// ─── Workshop Types ──────────────

export async function fetchWorkshopTypes() {
  const res = await api.get('/workshop-types/');
  return res.data;
}

export async function fetchWorkshopTypeDetail(id) {
  const res = await api.get(`/workshop-types/${id}/`);
  return res.data;
}

// ─── Profile ─────────────────────

export async function fetchOwnProfile() {
  const res = await api.get('/profile/');
  return res.data;
}

export async function updateProfile(data) {
  const res = await api.put('/profile/', data);
  return res.data;
}

export async function fetchUserProfile(userId) {
  const res = await api.get(`/profile/${userId}/`);
  return res.data;
}

// ─── Statistics ──────────────────

export async function fetchPublicStats(params = {}) {
  const res = await api.get('/statistics/public/', { params });
  return res.data;
}

export function getStatsDownloadUrl(params = {}) {
  const query = new URLSearchParams(params).toString();
  return `/api/statistics/public/download/?${query}`;
}

// ─── Choices ─────────────────────

export async function fetchChoices() {
  const res = await api.get('/choices/');
  return res.data;
}

export default api;
