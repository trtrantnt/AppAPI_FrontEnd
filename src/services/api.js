// src/services/api.js
import axios from 'axios';
import store from '@/store';
import router from '@/router';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL của backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor thêm token vào mỗi request
api.interceptors.request.use(
  config => {
    const token = store.getters['auth/token'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor xử lý response, xử lý lỗi xác thực
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      store.dispatch('auth/logout');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;