import api from './api';

const API_URL = 'http://localhost:3000/categories';

class CategoryService {
  getAll(params = {}) {
    return api.get(API_URL, { params });
  }

  getById(id) {
    return api.get(`${API_URL}/${id}`);
  }

  create(categoryData) {
    return api.post(API_URL, categoryData);
  }

  update(id, categoryData) {
    return api.put(`${API_URL}/${id}`, categoryData);
  }

  delete(id) {
    return api.delete(`${API_URL}/${id}`);
  }

  getCategoriesWithProductCount() {
    return api.get(`${API_URL}?withCount=true`);
  }
}

export default new CategoryService();
