import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Add a request interceptor to include the token in headers
// This assumes the token is stored in localStorage after login
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;  // Token auth
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
