// src/store/index.js
import { createStore } from 'vuex'
import menu from './modules/menu.module'

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    cart: []
  },
  getters: {
    getUser(state) {
      return state.user
    },
    isAuthenticated(state) {
      return state.isAuthenticated
    },
    getCart(state) {
      return state.cart
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    addToCart(state, item) {
      state.cart.push(item)
    },
    removeFromCart(state, itemId) {
      state.cart = state.cart.filter(item => item.id !== itemId)
    },
    clearCart(state) {
      state.cart = []
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('setUser', null)
    }
  },
  modules: {
    menu
  }
})