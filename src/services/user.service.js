import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:4000/api/users';

class UserService {
  getAll(params = {}) {
    return axios.get(API_URL, { 
      params, 
      headers: authHeader() 
    });
  }

  getById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  createUser(userData) {
    return axios.post(API_URL, userData, { headers: authHeader() });
  }

  updateUser(id, userData) {
    return axios.put(`${API_URL}/${id}`, userData, { headers: authHeader() });
  }

  deleteUser(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

export default new UserService();
