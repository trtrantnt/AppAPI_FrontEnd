<!-- src/components/layout/AdminLayout.vue -->
<template>
    <div class="admin-layout d-flex">
      <AdminSidebar />
      
      <div class="admin-content flex-grow-1">
        <AdminHeader />
        
        <main class="p-4">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import AdminSidebar from '@/components/common/AdminSidebar.vue';
  import AdminHeader from '@/components/common/AdminHeader.vue';
  
  export default {
    name: 'AdminLayout',
    components: {
      AdminSidebar,
      AdminHeader
    }
  };
  </script>