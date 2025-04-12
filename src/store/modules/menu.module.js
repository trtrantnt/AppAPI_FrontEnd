import MenuService from '@/services/menu.service';

export default {
  namespaced: true,
  state: {
    menus: [],
    loading: false,
    error: null
  },
  mutations: {
    setMenus(state, menus) {
      state.menus = menus;
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchMenus({ commit }) {
      commit('setLoading', true);
      try {
        const response = await MenuService.getAll();
        commit('setMenus', response.data.data);
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to fetch menus');
      } finally {
        commit('setLoading', false);
      }
    }
  },
  getters: {
    menus: state => state.menus
  }
};
