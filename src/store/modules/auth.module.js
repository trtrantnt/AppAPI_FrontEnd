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
          
          // After successful login, fetch the complete user details
          try {
            const userResponse = await AuthService.getCurrentUser();
            if (userResponse.data && userResponse.data.data) {
              console.log("User details fetched:", userResponse.data.data);
              commit('updateUser', userResponse.data.data);
            }
          } catch (userError) {
            console.error("Error fetching user details:", userError);
            // Continue with the basic user info we have
          }
          
          // Redirect based on role
          if (result.user && result.user.role && 
              ((typeof result.user.role === 'object' && result.user.role.name === 'admin') ||
               (typeof result.user.role === 'string' && result.user.role === 'admin'))) {
            router.push('/admin');
          } else {
            router.push('/');
          }
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
      if (!state.user) return false;
      
      // Handle different role structures
      if (state.user.role) {
        // If role is a direct property
        if (typeof state.user.role === 'object' && state.user.role.name) {
          return state.user.role.name === role;
        } else if (typeof state.user.role === 'string') {
          return state.user.role === role;
        }
      }
      
      // Handle roles as array
      if (state.user.roles && Array.isArray(state.user.roles)) {
        return state.user.roles.some(r => {
          if (typeof r === 'object') return r.name === role;
          return r === role;
        });
      }
      
      return false;
    },
    isAdmin: state => {
      if (!state.user) return false;
      
      // For debugging
      console.log("Checking admin status with user:", state.user);
      
      // Check directly if there is a role property
      if (state.user.role) {
        // If role is an object with name property
        if (typeof state.user.role === 'object' && state.user.role.name) {
          return state.user.role.name === 'admin';
        } 
        // If role is a string
        else if (typeof state.user.role === 'string') {
          return state.user.role === 'admin';
        }
      }
      
      // Check if there's a roles array
      if (state.user.roles && Array.isArray(state.user.roles)) {
        return state.user.roles.some(r => {
          if (typeof r === 'object') return r.name === 'admin';
          return r === 'admin';
        });
      }
      
      return false;
    },
    isModerator: state => {
      if (!state.user || !state.user.roles) return false;
      return state.user.roles.some(r => r.name === 'mod');
    }
  }
};