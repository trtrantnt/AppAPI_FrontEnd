<template>
  <div class="auth-layout">
    <app-navbar />
    <div class="container py-4">
      <div class="text-center mb-4">
        <router-link to="/" class="navbar-brand">
          <h1>Scan & Savor</h1>
        </router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import AppNavbar from '@/components/common/AppNavbar.vue'

export default {
  name: 'AuthLayout',
  components: {
    AppNavbar
  }
}
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}
</style>
