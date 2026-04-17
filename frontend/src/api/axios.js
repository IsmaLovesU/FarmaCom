import axios from 'axios';
import { notifyUnauthorized } from './authSession';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const skipAuthHandling = error.config?.skipAuthHandling;

    if (status === 401 && !skipAuthHandling) {
      notifyUnauthorized(error);
    }

    return Promise.reject(error);
  },
);

export default api;
