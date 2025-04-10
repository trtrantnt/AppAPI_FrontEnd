<template>
  <div class="forgot-password">
    <h2 class="text-center mb-4">Quên mật khẩu</h2>
    
    <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'" role="alert">
      {{ message }}
    </div>
    
    <form @submit.prevent="handleForgotPassword" v-if="!successful">
      <div class="mb-4">
        <p>Vui lòng nhập địa chỉ email của bạn. Chúng tôi sẽ gửi một liên kết để đặt lại mật khẩu.</p>
      </div>
      
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="email"
          required
          email
        />
      </div>
      
      <div class="d-grid gap-2">
        <button class="btn btn-primary" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Gửi liên kết đặt lại
        </button>
      </div>
    </form>
    
    <div class="text-center mt-3">
      <p>Nhớ mật khẩu? <router-link to="/login">Đăng nhập</router-link></p>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/auth.service';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false,
      successful: false,
      message: ''
    };
  },
  methods: {
    async handleForgotPassword() {
      this.loading = true;
      this.message = '';
      
      try {
        const response = await AuthService.forgotPassword(this.email);
        this.successful = true;
        this.message = response.data.message || 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.';
      } catch (error) {
        this.message = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
