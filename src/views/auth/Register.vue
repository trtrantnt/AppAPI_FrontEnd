<template>
  <div class="register-container">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Đăng ký tài khoản</h4>
      </div>
      <div class="card-body">
        <div v-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="username" class="form-label">Tên đăng nhập</label>
            <input 
              type="text"
              id="username"
              v-model="formData.username"
              class="form-control" 
              required
              autofocus
            />
            <small class="text-muted">Tối thiểu 6 ký tự</small>
          </div>
          
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email"
              v-model="formData.email"
              class="form-control" 
              required
            />
          </div>
          
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu</label>
            <input 
              type="password" 
              id="password"
              v-model="formData.password"
              class="form-control" 
              required
            />
            <small class="text-muted">
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
            </small>
          </div>
          
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              id="confirmPassword"
              v-model="formData.confirmPassword"
              class="form-control" 
              required
            />
          </div>
          
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Đăng ký
            </button>
          </div>
        </form>
        
        <div class="mt-3 text-center">
          <p>Đã có tài khoản? <router-link to="/auth/login">Đăng nhập</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'RegisterPage',
  data() {
    return {
      formData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      loading: 'auth/loading',
      error: 'auth/error'
    })
  },
  methods: {
    ...mapActions({
      register: 'auth/register',
      clearError: 'auth/clearAuthError'
    }),
    async handleRegister() {
      // Validate form data first
      if (this.formData.password !== this.formData.confirmPassword) {
        // Using auth/authError mutation directly through a custom action
        this.$store.commit('auth/authError', 'Mật khẩu xác nhận không khớp');
        return;
      }
      
      try {
        // Prepare data to match backend requirements
        const userData = {
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.password
        };
        
        const response = await this.register(userData);
        
        if (response && response.data && response.data.success) {
          this.$router.push({
            path: '/auth/login',
            query: { registered: 'success' }
          });
        }
      } catch (error) {
        console.error('Registration failed:', error);
      }
    }
  },
  created() {
    this.clearError();
  }
};
</script>

<style scoped>
.register-container {
  max-width: 500px;
  margin: 0 auto;
}
</style>
