<template>
  <div class="register">
    <h2 class="text-center mb-4">Đăng ký tài khoản</h2>
    
    <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'" role="alert">
      {{ message }}
    </div>
    
    <form @submit.prevent="handleRegister" v-if="!successful">
      <div class="mb-3">
        <label for="name" class="form-label">Họ và tên</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="user.name"
          required
          minlength="3"
          maxlength="50"
        />
      </div>
      
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="user.email"
          required
          email
        />
      </div>
      
      <div class="mb-3">
        <label for="password" class="form-label">Mật khẩu</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="user.password"
          required
          minlength="6"
        />
      </div>
      
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          v-model="user.confirmPassword"
          required
        />
        <div v-if="passwordMismatch" class="form-text text-danger">
          Mật khẩu không khớp
        </div>
      </div>
      
      <div class="d-grid gap-2">
        <button class="btn btn-primary" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Đăng ký
        </button>
      </div>
    </form>
    
    <div class="text-center mt-3">
      <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  // Fix ESLint warning by using a multi-word component name
  name: 'RegisterView',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      loading: false,
      successful: false,
      message: ''
    };
  },
  computed: {
    passwordMismatch() {
      return this.user.password && this.user.confirmPassword && 
             this.user.password !== this.user.confirmPassword;
    }
  },
  methods: {
    ...mapActions('auth', ['register', 'clearAuthError']),
    
    async handleRegister() {
      // Validate form
      if (this.passwordMismatch) {
        this.message = 'Mật khẩu không khớp';
        return;
      }
      
      this.loading = true;
      this.message = '';
      
      try {
        const { name, email, password } = this.user;
        await this.register({ name, email, password });
        this.successful = true;
        this.message = 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.';
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);
      } catch (error) {
        this.message = error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký.';
      } finally {
        this.loading = false;
      }
    }
  },
  beforeUnmount() {
    this.clearAuthError();
  }
};
</script>
