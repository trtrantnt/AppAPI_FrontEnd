<template>
  <div class="admin-layout">
    <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">Admin Portal</a>
      <button 
        class="navbar-toggler position-absolute d-md-none collapsed" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#sidebarMenu" 
        aria-controls="sidebarMenu" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="w-100"></div>
      <div class="navbar-nav">
        <div class="nav-item text-nowrap">
          <a class="nav-link px-3" href="#" @click.prevent="handleLogout">
            <i class="bi bi-box-arrow-right me-1"></i>
            Đăng xuất
          </a>
        </div>
      </div>
    </header>

    <div class="container-fluid">
      <div class="row">
        <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div class="position-sticky pt-3 sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link class="nav-link" :class="{ active: $route.path === '/admin' }" to="/admin">
                  <i class="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :class="{ active: $route.path === '/admin/products' }" to="/admin/products">
                  <i class="bi bi-box me-2"></i>
                  Sản phẩm
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :class="{ active: $route.path === '/admin/categories' }" to="/admin/categories">
                  <i class="bi bi-tags me-2"></i>
                  Danh mục
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :class="{ active: $route.path === '/admin/orders' }" to="/admin/orders">
                  <i class="bi bi-cart me-2"></i>
                  Đơn hàng
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :class="{ active: $route.path === '/admin/users' }" to="/admin/users">
                  <i class="bi bi-people me-2"></i>
                  Người dùng
                </router-link>
              </li>
            </ul>
          </div>
        </nav>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AdminLayout',
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      hasAdminRole: 'auth/isAdmin',
      currentUser: 'auth/currentUser'
    })
  },
  created() {
    // Kiểm tra quyền admin khi vào trang quản trị
    this.checkAdminAccess();
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout',
      getCurrentUser: 'auth/getCurrentUser'
    }),
    async checkAdminAccess() {
      console.log("Checking admin access, current auth state:", {
        isLoggedIn: this.isLoggedIn,
        hasAdminRole: this.hasAdminRole,
        currentUser: this.currentUser
      });
      
      if (!this.isLoggedIn) {
        console.log("Not logged in, redirecting to login");
        this.$router.push('/auth/login');
        return;
      }
      
      // Refresh user data to ensure we have the latest role information
      try {
        await this.getCurrentUser();
        
        if (!this.hasAdminRole) {
          console.log("Not admin, redirecting to home");
          this.$router.push('/');
          this.$toast.error('Bạn không có quyền truy cập trang quản trị');
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        this.$router.push('/auth/login');
      }
    },
    async handleLogout() {
      try {
        await this.logout();
        this.$router.push('/auth/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 48px 0 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar-sticky {
  height: calc(100vh - 48px);
  overflow-x: hidden;
  overflow-y: auto;
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link.active {
  color: #007bff;
}

main {
  padding-top: 1.5rem;
}

@media (max-width: 767.98px) {
  .sidebar {
    position: static;
    height: auto;
    padding-top: 0;
  }
  
  main {
    margin-top: 1rem;
  }
}
</style>
