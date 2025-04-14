import api from './api';

const API_URL = 'http://localhost:3000/products';

class ProductService {
  getAll(params = {}) {
    return api.get(API_URL, { params })
      .then(response => {
        // Kiểm tra và điều chỉnh cấu trúc dữ liệu nhận được
        console.log('API Response:', response.data);
        
        // Nếu dữ liệu có cấu trúc lồng nhau, điều chỉnh để phù hợp với frontend
        if (response.data && response.data.data && response.data.data.data) {
          // Cấu trúc lồng 2 lần: {data: {data: [...]}}
          return {
            data: {
              data: response.data.data.data,
              total: response.data.data.total,
              page: response.data.data.page,
              limit: response.data.data.limit,
              totalPages: response.data.data.totalPages
            }
          };
        }
        
        return response;
      });
  }

  getById(id) {
    return api.get(`${API_URL}/${id}`)
      .then(response => {
        console.log('API Response (getById):', response.data);
        
        // Xử lý trường hợp dữ liệu lồng nhau
        if (response.data && response.data.data && response.data.data.data) {
          // Trả về cấu trúc phù hợp với frontend
          return {
            data: {
              data: response.data.data.data
            }
          };
        }
        
        return response;
      });
  }

  create(productData) {
    return api.post(API_URL, productData);
  }

  update(id, productData) {
    return api.put(`${API_URL}/${id}`, productData);
  }

  delete(id) {
    return api.delete(`${API_URL}/${id}`);
  }
}

export default new ProductService();