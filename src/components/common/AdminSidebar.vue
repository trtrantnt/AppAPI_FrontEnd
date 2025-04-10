<template>
  <div class="sidebar bg-light p-3 h-100">
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link to="/admin" class="nav-link" exact>Dashboard</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/products" class="nav-link">Products</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/categories" class="nav-link">Categories</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/users" class="nav-link">Users</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AdminSidebar'
}
</script>

<style scoped>
.sidebar {
  min-height: calc(100vh - 56px);
}
.nav-link.router-link-active {
  font-weight: bold;
  color: #0d6efd;
}
</style>
