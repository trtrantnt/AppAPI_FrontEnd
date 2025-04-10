<template>
  <div class="default-layout">
    <app-navbar />
    <main class="container py-4">
      <router-view />
    </main>
    <app-footer />
  </div>
</template>

<script>
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'

export default {
  name: 'DefaultLayout',
  components: {
    AppNavbar,
    AppFooter
  }
}
</script>
