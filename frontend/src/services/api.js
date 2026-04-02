import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ppa_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ppa_token');
      localStorage.removeItem('ppa_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Progress ──────────────────────────────────────────────────────────────
export const progressAPI = {
  getAll: () => api.get('/progress'),
  getCompany: (company) => api.get(`/progress/${encodeURIComponent(company)}`),
  saveRound: (company, data) => api.post(`/progress/${encodeURIComponent(company)}/round`, data),
  reset: (company) => api.delete(`/progress/${encodeURIComponent(company)}`),
};

// ─── Resume ────────────────────────────────────────────────────────────────
export const resumeAPI = {
  analyze: (data) => api.post('/resume/analyze', data),
  getHistory: () => api.get('/resume/history'),
};

// ─── Aptitude ──────────────────────────────────────────────────────────────
export const aptitudeAPI = {
  getQuestions: (company) => api.get(`/aptitude/questions/${encodeURIComponent(company)}`),
  submit: (data) => api.post('/aptitude/submit', data),
};

// ─── Coding ────────────────────────────────────────────────────────────────
export const codingAPI = {
  getProblem: (company) => api.get(`/coding/problem/${encodeURIComponent(company)}`),
  submit: (data) => api.post('/coding/submit', data),
  getHistory: () => api.get('/coding/history'),
};

// ─── Technical ─────────────────────────────────────────────────────────────
export const technicalAPI = {
  start: (data) => api.post('/technical/start', data),
  chat: (data) => api.post('/technical/chat', data),
  getHistory: () => api.get('/technical/history'),
};

// ─── HR ────────────────────────────────────────────────────────────────────
export const hrAPI = {
  start: (data) => api.post('/hr/start', data),
  chat: (data) => api.post('/hr/chat', data),
  getHistory: () => api.get('/hr/history'),
};

export default api;
