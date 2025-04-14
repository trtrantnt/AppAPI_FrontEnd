import api from './api';

const API_URL = 'http://localhost:3000/categories';

class CategoryService {
  getAll(params = {}) {
    return api.get(API_URL, { params });
  }

  getById(id) {
    return api.get(`${API_URL}/${id}`);
  }

  getCategoriesWithProductCount() {
    // Update this endpoint to match what's in the backend routes
    return api.get(`${API_URL}/with-products`);
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
}

export default new CategoryService();
