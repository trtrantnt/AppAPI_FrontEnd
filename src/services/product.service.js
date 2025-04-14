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
          // Xử lý mỗi sản phẩm để đảm bảo có trường image
          const products = response.data.data.data.map(product => {
            if (product.imgURL && !product.image) {
              product.image = product.imgURL;
            }
            return product;
          });
          
          return {
            data: {
              data: products,
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
          // Đảm bảo chuyển đổi trường imgURL thành image nếu cần
          const productData = response.data.data.data;
          if (productData.imgURL && !productData.image) {
            productData.image = productData.imgURL;
          }
          
          return {
            data: {
              data: productData
            }
          };
        }
        
        // Đảm bảo chuyển đổi trường imgURL thành image trong trường hợp đơn giản
        if (response.data && response.data.data) {
          if (response.data.data.imgURL && !response.data.data.image) {
            response.data.data.image = response.data.data.imgURL;
          }
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