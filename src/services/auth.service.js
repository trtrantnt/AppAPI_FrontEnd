// src/services/auth.service.js
import api from './api';

export default {
  login(credentials) {
    return api.post('/auth/login', credentials);
  },
  register(user) {
    return api.post('/auth/signup', user);
  },
  logout() {
    return api.post('/auth/logout');
  },
  getCurrentUser() {
    return api.get('/auth/me');
  },
  changePassword(passwords) {
    return api.post('/auth/change_password', passwords);
  },
  forgotPassword(email) {
    return api.post('/auth/forgotpassword', { email });
  },
  changeAvatar(formData) {
    return api.post('/auth/change_avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};