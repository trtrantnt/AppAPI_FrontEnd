// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

// Layouts
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import AuthLayout from '@/components/layout/AuthLayout.vue';

// Auth views
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';

// Public views
import Home from '@/views/Home.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import ProductList from '@/views/ProductList.vue';

// Admin views
import AdminDashboard from '@/views/admin/Dashboard.vue';
import AdminProducts from '@/views/admin/Products.vue';
import AdminCategories from '@/views/admin/Categories.vue';
import AdminUsers from '@/views/admin/Users.vue';

// User views
import UserProfile from '@/views/user/Profile.vue';
import ChangePassword from '@/views/user/ChangePassword.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'products', name: 'Products', component: ProductList },
      { path: 'products/:id', name: 'ProductDetail', component: ProductDetail },
      { 
        path: 'profile',
        name: 'Profile',
        component: UserProfile,
        meta: { requiresAuth: true }
      },
      { 
        path: 'change-password',
        name: 'ChangePassword',
        component: ChangePassword,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register },
      { path: 'forgot-password', name: 'ForgotPassword', component: ForgotPassword }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'products', name: 'AdminProducts', component: AdminProducts },
      { path: 'categories', name: 'AdminCategories', component: AdminCategories },
      { path: 'users', name: 'AdminUsers', component: AdminUsers }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isLoggedIn = store.getters['auth/isLoggedIn'];
  const isAdmin = store.getters['auth/isAdmin'];
  
  if (requiresAuth && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (requiresAdmin && !isAdmin) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;