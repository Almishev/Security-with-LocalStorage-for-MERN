import axios from 'axios';
import { getToken, removeToken } from './auth.js';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});


api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
   
    if (error.response?.status === 401) {
      removeToken();
     
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;