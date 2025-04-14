<!-- src/views/auth/Login.vue -->
<template>
  <div class="login-container">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Đăng nhập</h4>
      </div>
      <div class="card-body">
        <div v-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="form-label">Tên đăng nhập</label>
            <input 
              type="text"
              id="username"
              v-model="username"
              class="form-control" 
              required
              autofocus
            />
          </div>
          
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu</label>
            <input 
              type="password" 
              id="password"
              v-model="password"
              class="form-control" 
              required
            />
          </div>
          
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="remember" v-model="remember">
            <label class="form-check-label" for="remember">Ghi nhớ đăng nhập</label>
          </div>
          
          <div class="d-grid">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Đăng nhập
            </button>
          </div>
        </form>
        
        <div class="mt-3 text-center">
          <router-link to="/auth/forgot-password">Quên mật khẩu?</router-link>
          <div class="mt-2">
            Chưa có tài khoản? <router-link to="/auth/register">Đăng ký</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      remember: false
    }
  },
  computed: {
    ...mapGetters({
      error: 'auth/error',
      loading: 'auth/loading'
    })
  },
  methods: {
    ...mapActions({
      login: 'auth/login',
      clearError: 'auth/clearAuthError'
    }),
    async handleLogin() {
      if (!this.username || !this.password) {
        return;
      }
      
      try {
        const success = await this.login({
          username: this.username,
          password: this.password
        });
        
        if (success) {
          console.log('Login successful, redirecting...');
          // Router push is handled in the store action
        }
      } catch (error) {
        console.error('Login failed', error);
      }
    }
  },
  created() {
    // Clear any previous auth errors when component is created
    if (this.clearError) this.clearError();
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.card {
  width: 400px;
  max-width: 100%;
}
</style>