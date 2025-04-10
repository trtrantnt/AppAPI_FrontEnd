<template>
  <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="position-sticky pt-3">
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>Quản lý</span>
      </h6>
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
          <router-link class="nav-link" :class="{ active: $route.path === '/admin/users' }" to="/admin/users">
            <i class="bi bi-people me-2"></i>
            Người dùng
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AdminSidebar'
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
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
}

.sidebar-heading {
  font-size: 0.75rem;
  text-transform: uppercase;
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link.active {
  color: #0d6efd;
}
</style>
