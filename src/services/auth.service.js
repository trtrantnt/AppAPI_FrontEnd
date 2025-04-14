import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password
      });
      
      if (response.data && response.data.data) {
        // Store the token
        const token = response.data.data;
        localStorage.setItem('token', token);
        
        // Create a basic user object since /me is failing
        const basicUser = { username: username };
        localStorage.setItem('user', JSON.stringify(basicUser));
        
        return { success: true, user: basicUser, token };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  }

  register(userData) {
    return axios.post(`${API_URL}/signup`, userData);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();