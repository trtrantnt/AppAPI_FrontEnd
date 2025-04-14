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
import CategoryService from '@/services/category.service';
import UserService from '@/services/user.service';
import OrderService from '@/services/order.service';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      statistics: {
        products: 0,
        categories: 0,
        users: 0,
        orders: 0
      },
      recentProducts: [],
      loading: true
    };
  },
  mounted() {
    this.fetchStatistics();
    this.fetchRecentProducts();
  },
  methods: {
    async fetchStatistics() {
      this.loading = true;
      try {
        // Fetch product statistics directly
        const productsRes = await ProductService.getAll();
        console.log('Products response:', productsRes.data);
        // Make sure we correctly extract the product count
        if (productsRes.data) {
          if (productsRes.data.totalItems !== undefined) {
            this.statistics.products = productsRes.data.totalItems;
          } else if (productsRes.data.data && Array.isArray(productsRes.data.data)) {
            this.statistics.products = productsRes.data.data.length;
          }
        }
        
        // Fetch category statistics directly
        const categoriesRes = await CategoryService.getAll();
        console.log('Categories response for dashboard:', categoriesRes);
        
        // Handle different response formats
        if (categoriesRes.data) {
          if (categoriesRes.data.success && Array.isArray(categoriesRes.data.data)) {
            this.statistics.categories = categoriesRes.data.data.length;
          } else if (Array.isArray(categoriesRes.data)) {
            this.statistics.categories = categoriesRes.data.length;
          } else if (categoriesRes.data.data && Array.isArray(categoriesRes.data.data)) {
            this.statistics.categories = categoriesRes.data.data.length;
          } else {
            this.statistics.categories = 0;
            console.warn('Unexpected categories response format:', categoriesRes);
          }
        }
        
        const usersRes = await UserService.getAll();
        if (usersRes.data && usersRes.data.data) {
          this.statistics.users = usersRes.data.data.length;
        }
        
        // Handle orders in a safer way
        try {
          const ordersRes = await OrderService.getAll();
          if (ordersRes.data && ordersRes.data.data) {
            this.statistics.orders = ordersRes.data.data.length;
          }
        } catch (e) {
          console.log('Order service API might not be implemented yet:', e);
          this.statistics.orders = 0;
        }
        
        console.log('Dashboard statistics updated:', this.statistics);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        this.$toast?.error('Failed to load dashboard statistics');
      } finally {
        this.loading = false;
      }
    },
    async fetchRecentProducts() {
      try {
        const response = await ProductService.getAll({
          sort: '-createdAt',
          limit: 5
        });
        this.recentProducts = response.data.data || [];
      } catch (error) {
        console.error('Error fetching recent products:', error);
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
