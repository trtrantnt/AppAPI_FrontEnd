// src/store/modules/auth.module.js
import AuthService from '@/services/auth.service';
import router from '@/router';

export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
    loading: false,
    error: null
  },
  mutations: {
    authRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, { user, token }) {
      state.user = user;
      state.token = token;
      state.loading = false;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    authError(state, error) {
      state.loading = false;
      state.error = error;
    },
    logout(state) {
      state.user = null;
      state.token = '';
      state.loading = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
    async login({ commit }, { username, password }) {
      commit('authRequest');
      try {
        const result = await AuthService.login(username, password);
        
        if (result.success) {
          commit('loginSuccess', { user: result.user, token: result.token });
          
          // Redirect regardless of /me endpoint success
          router.push('/');
          return true;
        } else {
          commit('authError', result.error || 'Login failed');
          return false;
        }
      } catch (error) {
        commit('authError', error.response?.data?.message || 'Login failed');
        return false;
      }
    },
    async register({ commit }, userData) {
      commit('authRequest');
      try {
        // Call the signup endpoint with the required fields
        const response = await AuthService.register(userData);
        return response;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                            (Array.isArray(error.response?.data) ? error.response.data[0].msg : 'Registration failed');
        commit('authError', errorMessage);
        throw error;
      }
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
      router.push('/auth/login');
    },
    async getCurrentUser({ commit, state }) {
      // Không cần gọi API nếu không có token
      if (!state.token) {
        return null;
      }
      
      commit('authRequest');
      try {
        const response = await AuthService.getCurrentUser();
        const user = response.data.data;
        commit('updateUser', user);
        return user;
      } catch (error) {
        commit('authError', error.response?.data?.message || 'Failed to get user data');
        // Nếu lỗi 401 Unauthorized, đăng xuất
        if (error.response?.status === 401) {
          commit('logout');
        }
        throw error;
      }
    },
    async changePassword({ commit }, passwords) {
      try {
        const response = await AuthService.changePassword(passwords);
        return response;
      } catch (error) {
        commit('authError', error.response?.data?.message || 'Failed to change password');
        throw error;
      }
    },
    async updateProfile({ commit }, userData) {
      try {
        const response = await AuthService.updateProfile(userData);
        const updatedUser = response.data.data;
        commit('updateUser', updatedUser);
        return updatedUser;
      } catch (error) {
        commit('authError', error.response?.data?.message || 'Failed to update profile');
        throw error;
      }
    },
    async changeAvatar({ commit, state }, formData) {
      try {
        const response = await AuthService.changeAvatar(formData);
        // Cập nhật user với avatar mới
        const updatedUser = {
          ...state.user,
          avatar: response.data.data.avatar
        };
        commit('updateUser', updatedUser);
        return updatedUser;
      } catch (error) {
        commit('authError', error.response?.data?.message || 'Failed to change avatar');
        throw error;
      }
    },
    clearAuthError({ commit }) {
      commit('clearError');
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    currentUser: state => state.user,
    token: state => state.token,
    loading: state => state.loading,
    error: state => state.error,
    hasRole: state => role => {
      if (!state.user || !state.user.roles) return false;
      return state.user.roles.some(r => r.name === role);
    },
    isAdmin: state => {
      if (!state.user || !state.user.roles) return false;
      return state.user.roles.some(r => r.name === 'admin');
    },
    isModerator: state => {
      if (!state.user || !state.user.roles) return false;
      return state.user.roles.some(r => r.name === 'mod');
    }
  }
};