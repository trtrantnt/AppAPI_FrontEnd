<template>
  <div class="auth-layout">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="text-center mb-4">
            <h1>E-Commerce App</h1>
          </div>
          <div class="card shadow">
            <div class="card-body p-4">
              <router-view />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
};
</script>

<style scoped>
.auth-layout {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
