import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/orders';

class OrderService {
  getAll(params = {}) {
    return axios.get(API_URL, { 
      params,
      headers: authHeader() 
    });
  }

  getById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  create(orderData) {
    return axios.post(API_URL, orderData, { headers: authHeader() });
  }

  update(id, orderData) {
    return axios.put(`${API_URL}/${id}`, orderData, { headers: authHeader() });
  }

  delete(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
  
  // Add this method for dashboard stats
  getDashboardStats() {
    return axios.get(`${API_URL}/stats`, { headers: authHeader() });
  }
}

export default new OrderService();
