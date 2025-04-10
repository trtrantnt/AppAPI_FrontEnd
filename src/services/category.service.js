import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:4000/api/categories';

class CategoryService {
  getAll(params = {}) {
    return axios.get(API_URL, { 
      params,
      headers: authHeader() 
    });
  }

  getById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  create(categoryData) {
    return axios.post(API_URL, categoryData, { headers: authHeader() });
  }

  update(id, categoryData) {
    return axios.put(`${API_URL}/${id}`, categoryData, { headers: authHeader() });
  }

  delete(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

export default new CategoryService();
