<template>
  <div class="admin-layout">
    <admin-header />
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3 col-lg-2">
          <admin-sidebar />
        </div>
        <div class="col-md-9 col-lg-10 px-4 py-3">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminHeader from '@/components/common/AdminHeader.vue'
import AdminSidebar from '@/components/common/AdminSidebar.vue'

export default {
  name: 'AdminLayout',
  components: {
    AdminHeader,
    AdminSidebar
  }
}
</script>
