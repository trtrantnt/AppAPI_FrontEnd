import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:4000/api/admin';

class AdminService {
  getDashboardStats() {
    return axios.get(`${API_URL}/dashboard`, { headers: authHeader() });
  }
  
  getSystemLogs(params) {
    return axios.get(`${API_URL}/logs`, { 
      params,
      headers: authHeader() 
    });
  }
}

export default new AdminService();
