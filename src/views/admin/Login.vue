<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow mt-5">
          <div class="card-header bg-primary text-white text-center py-3">
            <h4 class="mb-0">Đăng nhập quản trị</h4>
          </div>
          <div class="card-body p-4">
            <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
              {{ message }}
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Tên đăng nhập</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="user.username"
                    required
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    id="password"
                    v-model="user.password"
                    required
                    placeholder="Nhập mật khẩu"
                  />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="rememberMe" v-model="user.rememberMe">
                <label class="form-check-label" for="rememberMe">Ghi nhớ đăng nhập</label>
              </div>

              <div class="d-grid">
                <button class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AdminLogin',
  data() {
    return {
      user: {
        username: '',
        password: '',
        rememberMe: false
      },
      loading: false,
      message: '',
      successful: false,
      showPassword: false
    };
  },
  created() {
    // Nếu người dùng đã đăng nhập và có quyền admin, chuyển hướng đến dashboard
    if (this.$store.getters['auth/isLoggedIn'] && this.$store.getters['auth/hasAdminRole']) {
      this.$router.push('/admin/dashboard');
    }
  },
  methods: {
    ...mapActions({
      login: 'auth/login'
    }),
    async handleLogin() {
      this.loading = true;
      this.message = '';
      
      try {
        await this.login({
          username: this.user.username,
          password: this.user.password
        });
        
        // Kiểm tra vai trò admin sau khi đăng nhập
        if (this.$store.getters['auth/hasAdminRole']) {
          this.successful = true;
          this.message = 'Đăng nhập thành công!';
          setTimeout(() => {
            this.$router.push('/admin/dashboard');
          }, 1000);
        } else {
          this.successful = false;
          this.message = 'Bạn không có quyền truy cập vào trang quản trị.';
          // Đăng xuất vì không có quyền admin
          this.$store.dispatch('auth/logout');
        }
      } catch (error) {
        this.successful = false;
        this.message = error.response?.data?.message || 'Đã xảy ra lỗi trong quá trình đăng nhập.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 10px;
}

.card-header {
  border-radius: 10px 10px 0 0 !important;
}
</style>
