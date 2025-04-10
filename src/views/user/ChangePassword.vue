<template>
  <div class="change-password">
    <h1 class="mb-4">Đổi mật khẩu</h1>
    
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'" role="alert">
              {{ message }}
            </div>
            
            <form @submit.prevent="handleChangePassword" v-if="!successful">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  class="form-control"
                  id="currentPassword"
                  v-model="form.currentPassword"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="newPassword" class="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  class="form-control"
                  id="newPassword"
                  v-model="form.newPassword"
                  required
                  minlength="6"
                />
                <div class="form-text">
                  Mật khẩu phải có ít nhất 6 ký tự.
                </div>
              </div>
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  required
                />
                <div v-if="passwordMismatch" class="form-text text-danger">
                  Mật khẩu xác nhận không khớp.
                </div>
              </div>
              
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="loading || passwordMismatch">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đổi mật khẩu
                </button>
              </div>
            </form>
            
            <div v-if="successful" class="text-center">
              <router-link to="/profile" class="btn btn-outline-primary">
                <i class="bi bi-arrow-left me-2"></i> Quay lại hồ sơ
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ChangePasswordView',
  data() {
    return {
      form: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      loading: false,
      successful: false,
      message: ''
    };
  },
  computed: {
    passwordMismatch() {
      return this.form.newPassword && 
             this.form.confirmPassword && 
             this.form.newPassword !== this.form.confirmPassword;
    }
  },
  methods: {
    ...mapActions('auth', ['changePassword', 'clearAuthError']),
    
    async handleChangePassword() {
      if (this.passwordMismatch) {
        this.message = 'Mật khẩu xác nhận không khớp với mật khẩu mới.';
        return;
      }
      
      this.loading = true;
      this.message = '';
      
      try {
        await this.changePassword({
          oldPassword: this.form.currentPassword,
          newPassword: this.form.newPassword
        });
        
        this.successful = true;
        this.message = 'Mật khẩu đã được thay đổi thành công.';
        this.form = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      } catch (error) {
        this.successful = false;
        this.message = error.response?.data?.message || 'Đã xảy ra lỗi khi thay đổi mật khẩu.';
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
