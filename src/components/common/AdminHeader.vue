<template>
  <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Admin Dashboard</a>
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
      <div class="nav-item text-nowrap d-flex">
        <router-link class="nav-link px-3" to="/">Trang chủ</router-link>
        <a class="nav-link px-3" href="#" @click.prevent="logout">Đăng xuất</a>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AdminHeader',
  methods: {
    ...mapActions('auth', ['logout'])
  }
};
</script>

<style scoped>
.navbar-brand {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, 0.25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25);
}
</style>
