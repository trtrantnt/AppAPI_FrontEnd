<!-- src/components/layout/DefaultLayout.vue -->
<template>
    <div class="default-layout">
      <header>
        <AppNavbar />
      </header>
      
      <main class="container py-4">
        <router-view />
      </main>
      
      <AppFooter />
    </div>
  </template>
  
  <script>
  import AppNavbar from '@/components/common/AppNavbar.vue';
  import AppFooter from '@/components/common/AppFooter.vue';
  
  export default {
    name: 'DefaultLayout',
    components: {
      AppNavbar,
      AppFooter
    }
  };
  </script>