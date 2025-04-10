<!-- src/views/auth/Login.vue -->
<template>
  <div class="login-container">
    <div class="card">
      <div class="card-header">
        <h3>Login</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email" v-model="email" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" required>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="remember" v-model="remember">
            <label class="form-check-label" for="remember">Remember me</label>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      remember: false
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        // Here you would normally make an API call to authenticate
        const user = { email: this.email }
        this.login(user)
        this.$router.push('/')
      } catch (error) {
        console.error('Login failed', error)
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.card {
  width: 400px;
  max-width: 100%;
}
</style>