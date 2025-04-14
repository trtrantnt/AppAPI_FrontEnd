import CategoryService from '@/services/category.service';

export default {
  namespaced: true,
  state: {
    categories: [],
    category: null,
    loading: false,
    error: null
  },
  mutations: {
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, error) {
      state.error = error;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setCategory(state, category) {
      state.category = category;
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
    async fetchCategories({ commit }) {
      commit('setLoading', true);
      try {
        const response = await CategoryService.getAll();
        
        // Handle different response structures
        let categories = [];
        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            categories = response.data.data;
          } else if (Array.isArray(response.data)) {
            categories = response.data;
          }
        }
        
        commit('setCategories', categories);
        return { data: categories };
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to fetch categories');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    async fetchCategoryById({ commit }, id) {
      commit('setLoading', true);
      try {
        const response = await CategoryService.getById(id);
        commit('setCategory', response.data.data);
        return response.data.data;
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to fetch category');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    async createCategory({ commit }, categoryData) {
      commit('setLoading', true);
      try {
        const response = await CategoryService.create(categoryData);
        return response.data;
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to create category');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    async updateCategory({ commit }, { id, categoryData }) {
      commit('setLoading', true);
      try {
        const response = await CategoryService.update(id, categoryData);
        return response.data;
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to update category');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    async deleteCategory({ commit }, id) {
      commit('setLoading', true);
      try {
        const response = await CategoryService.delete(id);
        return response.data;
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to delete category');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    clearCategoryError({ commit }) {
      commit('clearError');
    }
  },
  getters: {
    categories: state => state.categories,
    category: state => state.category,
    loading: state => state.loading,
    error: state => state.error
  }
};
