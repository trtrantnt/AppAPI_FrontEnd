// src/store/index.js
import { createStore } from 'vuex';
import auth from './modules/auth.module';
import product from './modules/product.module';
import category from './modules/category.module';

export default createStore({
  modules: {
    auth,
    product,
    category
  }
});