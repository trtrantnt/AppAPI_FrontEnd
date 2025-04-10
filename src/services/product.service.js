// src/services/product.service.js
import api from './api';

export default {
  getAll(params) {
    return api.get('/products', { params });
  },
  get(id) {
    return api.get(`/products/${id}`);
  },
  create(data) {
    return api.post('/products', data);
  },
  update(id, data) {
    return api.put(`/products/${id}`, data);
  },
  delete(id) {
    return api.delete(`/products/${id}`);
  }
};