import api from './api';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:4000';

class ImageService {
  /**
   * Trả về URL đầy đủ cho ảnh
   * @param {string} imagePath - Đường dẫn tương đối của ảnh
   * @returns {string} URL đầy đủ của ảnh
   */
  getImageUrl(imagePath) {
    if (!imagePath) return '/images/placeholder.jpg';
    
    // Kiểm tra nếu đã là URL đầy đủ
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Xử lý trường hợp đặc biệt cho tên trường image hoặc imgURL
    // Nối với URL cơ sở
    return `${API_BASE_URL}/${imagePath}`;
  }
  
  /**
   * Upload ảnh sản phẩm
   * @param {File} file - File ảnh cần upload
   * @returns {Promise} - Promise với kết quả upload
   */
  uploadProductImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    // Use the CDN server endpoint running on port 4000
    return api.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  /**
   * Upload ảnh avatar người dùng
   * @param {File} file - File ảnh avatar cần upload
   * @returns {Promise} - Promise với kết quả upload
   */
  uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    // Use the avatar upload endpoint on CDN server
    // Note: Based on auth.js, the backend expects this to be sent to the CDN server
    return api.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  /**
   * Xử lý phản hồi từ server sau khi upload
   * @param {Object} response - Phản hồi từ server
   * @returns {string} URL của ảnh đã upload
   */
  processUploadResponse(response) {
    // CDN server returns the URL in response.data format
    if (response && response.data) {
      if (typeof response.data === 'string') {
        return response.data;
      }
      
      if (response.data.data) {
        return response.data.data;
      }
    }
    
    console.warn('Unexpected upload response format:', response);
    return null;
  }
}

export default new ImageService();
