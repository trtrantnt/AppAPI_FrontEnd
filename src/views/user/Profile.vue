<template>
  <div class="profile">
    <h1 class="mb-4">Hồ sơ người dùng</h1>
    
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="avatar-container mb-3">
              <img
                :src="avatarUrl"
                alt="User avatar"
                class="avatar-img rounded-circle img-thumbnail"
              />
              <div class="avatar-upload">
                <label for="avatarInput" class="btn btn-sm btn-light rounded-circle">
                  <i class="bi bi-camera"></i>
                </label>
                <input 
                  type="file" 
                  id="avatarInput" 
                  class="d-none" 
                  accept="image/*"
                  @change="handleAvatarChange"
                />
              </div>
            </div>
            
            <h5 class="card-title">{{ user.name }}</h5>
            <p class="card-text text-muted">{{ user.email }}</p>
            
            <div class="mb-3">
              <span 
                v-for="role in user.roles" 
                :key="role._id" 
                class="badge"
                :class="{
                  'bg-primary': role.name === 'user',
                  'bg-info': role.name === 'mod',
                  'bg-danger': role.name === 'admin'
                }"
                style="margin-right: 3px;"
              >
                {{ role.name }}
              </span>
            </div>
            
            <div class="d-grid gap-2 mt-3">
              <router-link to="/change-password" class="btn btn-outline-primary">
                Đổi mật khẩu
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Thông tin cá nhân</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'" role="alert">
                {{ message }}
              </div>
              
              <div class="mb-3">
                <label for="name" class="form-label">Họ và tên</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="form.name"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="form.email"
                  disabled
                />
                <div class="form-text text-muted">
                  Email không thể thay đổi.
                </div>
              </div>
              
              <div class="mb-3">
                <label for="phone" class="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  class="form-control"
                  id="phone"
                  v-model="form.phone"
                />
              </div>
              
              <div class="mb-3">
                <label for="address" class="form-label">Địa chỉ</label>
                <textarea
                  class="form-control"
                  id="address"
                  rows="3"
                  v-model="form.address"
                ></textarea>
              </div>
              
              <div class="text-end">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Cập nhật thông tin
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
import { mapActions, mapGetters } from 'vuex';

export default {
  // Fix ESLint warning by using a multi-word component name
  name: 'ProfileView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      loading: false,
      successful: false,
      message: '',
      avatarLoading: false
    };
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    user() {
      return this.currentUser || {};
    },
    avatarUrl() {
      if (this.user && this.user.avatar) {
        return `http://localhost:4000/${this.user.avatar}`;
      }
      return '/default-avatar.png';
    }
  },
  created() {
    this.initFormData();
  },
  methods: {
    ...mapActions('auth', ['updateProfile', 'changeAvatar']),
    
    initFormData() {
      if (this.user) {
        this.form = {
          name: this.user.name || '',
          email: this.user.email || '',
          phone: this.user.phone || '',
          address: this.user.address || ''
        };
      }
    },
    
    async handleUpdateProfile() {
      this.loading = true;
      this.message = '';
      
      try {
        await this.updateProfile(this.form);
        this.successful = true;
        this.message = 'Thông tin cá nhân đã được cập nhật thành công.';
      } catch (error) {
        this.successful = false;
        this.message = error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin.';
      } finally {
        this.loading = false;
      }
    },
    
    async handleAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.message = 'Vui lòng chọn file hình ảnh (JPEG, PNG, GIF).';
        this.successful = false;
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        this.message = 'Kích thước file không được vượt quá 2MB.';
        this.successful = false;
        return;
      }
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      this.avatarLoading = true;
      this.message = '';
      
      try {
        await this.changeAvatar(formData);
        this.successful = true;
        this.message = 'Ảnh đại diện đã được cập nhật thành công.';
      } catch (error) {
        this.successful = false;
        this.message = error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật ảnh đại diện.';
      } finally {
        this.avatarLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.avatar-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload {
  position: absolute;
  right: 5px;
  bottom: 5px;
}

.avatar-upload .btn {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
