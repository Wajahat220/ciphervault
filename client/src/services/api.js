import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('cv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Files
export const uploadFile = (formData) =>
  API.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getFiles = () => API.get('/files');
export const downloadFile = (id) =>
  API.get(`/files/${id}/download`, { responseType: 'blob' });
export const verifyFile = (id) => API.get(`/files/${id}/verify`);
export const deleteFile = (id) => API.delete(`/files/${id}`);

// Tests
export const getAESPerf = () => API.get('/test/aes-performance');
export const getDESPerf = () => API.get('/test/des-performance');
export const getComparison = () => API.get('/test/comparison');
