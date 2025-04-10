<template>
  <div class="auth-layout">
    <div class="container py-4">
      <div class="text-center mb-4">
        <router-link to="/" class="navbar-brand">
          <h1>Your App Name</h1>
        </router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
}
</style>
