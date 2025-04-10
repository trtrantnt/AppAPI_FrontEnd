<!-- src/views/auth/Login.vue -->
<template>
    <div class="login-container">
      <div class="card">
        <div class="card-header">
          <h2 class="text-center">Đăng nhập</h2>
        </div>
        
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"
                required
              />
            </div>
            
            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="password"
                required
              />
            </div>
            
            <div class="mb-3 d-grid">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
              </button>
            </div>
            
            <div class="text-center">
              <router-link to="/auth/forgot-password">Quên mật khẩu?</router-link>
              <div class="mt-2">
                Chưa có tài khoản? 
                <router-link to="/auth/register">Đăng ký</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    data() {
      return {
        email: '',
        password: '',
        loading: false,
        error: null
      };
    },
    methods: {
      async handleSubmit() {
        this.loading = true;
        this.error = null;
        
        try {
          await this.$store.dispatch('auth/login', {
            email: this.email,
            password: this.password
          });
          
          // Redirect to intended page or home
          const redirectPath = this.$route.query.redirect || '/';
          this.$router.push(redirectPath);
        } catch (error) {
          this.error = error.response?.data?.message || 'Đăng nhập thất bại';
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 40px auto;
  }
  </style>