<template>
  <footer class="footer mt-auto py-3 bg-light">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <p>&copy; {{ currentYear }} E-Commerce App. All rights reserved.</p>
        </div>
        <div class="col-md-6 text-end">
          <p>
            <a href="#" class="me-3">Chính sách bảo mật</a>
            <a href="#" class="me-3">Điều khoản dịch vụ</a>
            <a href="#" class="me-3">Liên hệ</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style scoped>
.footer {
  margin-top: 40px;
}
</style>
