<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link class="navbar-brand" to="/">Scan & Savor</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Loading indicator for menus -->
          <li v-if="menuLoading" class="nav-item">
            <span class="nav-link">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading...
            </span>
          </li>
          
          <!-- Menu error message -->
          <li v-else-if="menuError" class="nav-item">
            <span class="nav-link text-danger">
              <i class="bi bi-exclamation-triangle-fill"></i>
              {{ menuError }}
            </span>
          </li>
          
          <!-- Removed the direct link to categories (Danh mục món ăn) -->
          
          <!-- Single Menu Items -->
          <li v-for="menu in singleMenus" :key="menu.url" class="nav-item">
            <router-link class="nav-link" :to="menu.url">{{ menu.text }}</router-link>
          </li>
          
          <!-- Dropdown Menu Items -->
          <li v-for="menu in dropdownMenus" :key="menu.url" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              {{ menu.text }}
            </a>
            <ul class="dropdown-menu">
              <li v-for="child in menu.children" :key="child.url">
                <router-link class="dropdown-item" :to="child.url">{{ child.text }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
        
        <!-- Auth Buttons -->
        <div class="d-flex">
          <template v-if="!isLoggedIn">
            <router-link to="/auth/login" class="btn btn-outline-primary me-2">
              Đăng nhập
            </router-link>
            <router-link to="/auth/register" class="btn btn-primary">
              Đăng ký
            </router-link>
          </template>
          <template v-else>
            <div class="dropdown">
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                {{ currentUser ? currentUser.fullname || currentUser.username : 'Tài khoản' }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><router-link class="dropdown-item" to="/user/profile">Thông tin tài khoản</router-link></li>
                <li><router-link class="dropdown-item" to="/user/orders">Đơn hàng của tôi</router-link></li>
                <li v-if="isAdmin"><router-link class="dropdown-item" to="/admin">Quản trị</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click.prevent="handleLogout">Đăng xuất</a></li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AppNavbar',
  data() {
    return {
      menus: [],
      menuLoading: false,
      menuError: null,
      retryCount: 0
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      currentUser: 'auth/currentUser',
      isAdmin: 'auth/isAdmin',
      storeMenus: 'menu/menus',
      menuLoadingState: 'menu/loading',
      menuErrorState: 'menu/error'
    }),
    dropdownMenus() {
      return this.menus.filter(menu => menu.children && menu.children.length > 0);
    },
    singleMenus() {
      return this.menus.filter(menu => !menu.children || menu.children.length === 0);
    }
  },
  watch: {
    // Watch for changes in the store menus
    storeMenus: {
      handler(newMenus) {
        if (newMenus && newMenus.length) {
          this.menus = newMenus;
        }
      },
      immediate: true
    },
    // Watch loading state from store
    menuLoadingState(newValue) {
      this.menuLoading = newValue;
    },
    // Watch error state from store
    menuErrorState(newValue) {
      this.menuError = newValue;
    }
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout',
      fetchMenus: 'menu/fetchMenus'
    }),
    async handleLogout() {
      try {
        await this.logout();
        this.$router.push('/auth/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    async loadMenus() {
      this.menuLoading = true;
      this.menuError = null;
      
      try {
        await this.fetchMenus();
        console.log('Menus loaded successfully:', this.storeMenus);
        this.menus = this.storeMenus || [];
      } catch (error) {
        console.error('Error loading menus:', error);
        this.menuError = 'Failed to load menu';
        
        // Retry logic if needed
        if (this.retryCount < 3) {
          this.retryCount++;
          setTimeout(() => {
            this.loadMenus();
          }, 2000); // Retry after 2 seconds
        }
      } finally {
        this.menuLoading = false;
      }
    }
  },
  created() {
    // Load menus when component is created
    this.loadMenus();
  }
};
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}

.nav-link .spinner-border-sm {
  margin-right: 5px;
}
</style>
