<template>
  <div class="dashboard">
    <h1 class="mb-4">Dashboard</h1>
    
    <div class="row">
      <div class="col-md-3 mb-4">
        <div class="card bg-primary text-white h-100">
          <div class="card-body">
            <h5 class="card-title">Sản phẩm</h5>
            <h2 class="card-text">{{ statistics.products || 0 }}</h2>
          </div>
          <div class="card-footer d-flex align-items-center justify-content-between">
            <router-link class="text-white text-decoration-none" to="/admin/products">
              Xem chi tiết
            </router-link>
            <div class="small text-white">
              <i class="bi bi-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-4">
        <div class="card bg-success text-white h-100">
          <div class="card-body">
            <h5 class="card-title">Danh mục</h5>
            <h2 class="card-text">{{ statistics.categories || 0 }}</h2>
          </div>
          <div class="card-footer d-flex align-items-center justify-content-between">
            <router-link class="text-white text-decoration-none" to="/admin/categories">
              Xem chi tiết
            </router-link>
            <div class="small text-white">
              <i class="bi bi-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-4">
        <div class="card bg-warning text-white h-100">
          <div class="card-body">
            <h5 class="card-title">Người dùng</h5>
            <h2 class="card-text">{{ statistics.users || 0 }}</h2>
          </div>
          <div class="card-footer d-flex align-items-center justify-content-between">
            <router-link class="text-white text-decoration-none" to="/admin/users">
              Xem chi tiết
            </router-link>
            <div class="small text-white">
              <i class="bi bi-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-4">
        <div class="card bg-danger text-white h-100">
          <div class="card-body">
            <h5 class="card-title">Đơn hàng</h5>
            <h2 class="card-text">{{ statistics.orders || 0 }}</h2>
          </div>
          <div class="card-footer d-flex align-items-center justify-content-between">
            <router-link class="text-white text-decoration-none" to="/admin/orders">
              Xem chi tiết
            </router-link>
            <div class="small text-white">
              <i class="bi bi-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-12 mb-4">
        <div class="card">
          <div class="card-header">
            <i class="bi bi-bar-chart-fill me-1"></i>
            Sản phẩm mới thêm gần đây
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-3">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Đang tải...</span>
              </div>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Danh mục</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in recentProducts" :key="product._id">
                    <td>{{ product.name }}</td>
                    <td>{{ formatPrice(product.price) }}</td>
                    <td>{{ product.category?.name || 'Chưa phân loại' }}</td>
                    <td>{{ formatDate(product.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductService from '@/services/product.service';
import AdminService from '@/services/admin.service';

export default {
  // Fix ESLint warning by using a multi-word component name
  name: 'DashboardView',
  data() {
    return {
      loading: true,
      statistics: {
        products: 0,
        categories: 0,
        users: 0,
        orders: 0
      },
      recentProducts: []
    };
  },
  created() {
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true;
      try {
        // Fetch dashboard statistics
        const statsResponse = await AdminService.getDashboardStats();
        this.statistics = statsResponse.data.data;
        
        // Fetch recent products
        const productsResponse = await ProductService.getAll({ limit: 5, sort: '-createdAt' });
        this.recentProducts = productsResponse.data.data;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    }
  }
};
</script>
