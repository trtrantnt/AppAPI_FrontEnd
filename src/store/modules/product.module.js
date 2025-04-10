import ProductService from '@/services/product.service';

export default {
  namespaced: true,
  state: {
    products: [],
    product: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1
  },
  mutations: {
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, error) {
      state.error = error;
    },
    setProducts(state, products) {
      state.products = products;
    },
    setProduct(state, product) {
      state.product = product;
    },
    setTotalPages(state, totalPages) {
      state.totalPages = totalPages;
    },
    setCurrentPage(state, page) {
      state.currentPage = page;
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
    async fetchProducts({ commit }, params = {}) {
      commit('setLoading', true);
      try {
        const response = await ProductService.getAll(params);
        commit('setProducts', response.data.data);
        commit('setTotalPages', response.data.totalPages || 1);
        commit('setCurrentPage', params.page || 1);
        return response.data;
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to fetch products');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    async fetchProductById({ commit }, id) {
      commit('setLoading', true);
      try {
        const response = await ProductService.getById(id);
        commit('setProduct', response.data.data);
        return response.data.data;
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to fetch product');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    async createProduct({ commit }, productData) {
      commit('setLoading', true);
      try {
        const response = await ProductService.create(productData);
        return response.data;
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to create product');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    async updateProduct({ commit }, { id, productData }) {
      commit('setLoading', true);
      try {
        const response = await ProductService.update(id, productData);
        return response.data;
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to update product');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    async deleteProduct({ commit }, id) {
      commit('setLoading', true);
      try {
        const response = await ProductService.delete(id);
        return response.data;
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to delete product');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    clearProductError({ commit }) {
      commit('clearError');
    }
  },
  getters: {
    products: state => state.products,
    product: state => state.product,
    loading: state => state.loading,
    error: state => state.error,
    totalPages: state => state.totalPages,
    currentPage: state => state.currentPage
  }
};
