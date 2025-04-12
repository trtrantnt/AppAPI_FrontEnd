<template>
  <div class="home">
    <section class="hero-section py-5 bg-light">
      <div class="container">
        <div class="row align-items-center text-center">
          <div class="col-md-6">
            <h2 class="display-4 fw-bold">Chào mừng đến với Scan & Savor</h2>
            <p class="lead my-4">Scan mã để order và tận hưởng món ăn.</p>
            <div class="mt-4">
              <router-link to="/auth/register" class="btn btn-outline-primary btn-lg">
                Đăng ký ngay
              </router-link>
            </div>
          </div>
          <div class="col-md-6 text-center">
            <img 
              src="@/assets/bg1.png"
              alt="Shopping" 
              class="img-fluid rounded hero-image" 
            />
          </div>
        </div>
      </div>
    </section>

    <section class="featured-products py-5">
      <div class="container">
        <h2 class="text-center mb-4">Sản phẩm nổi bật</h2>
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>
        <div v-else class="row">
          <div v-for="product in featuredProducts" :key="product._id" class="col-md-4 mb-4">
            <div class="card h-100">
              <img
                :src="product.image ? `http://localhost:4000/${product.image}` : '/placeholder.jpg'"
                class="card-img-top"
                :alt="product.name"
              />
              <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text">{{ product.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold">{{ formatPrice(product.price) }}</span>
                  <router-link :to="`/products/${product._id}`" class="btn btn-primary">
                    Xem chi tiết
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ProductService from '@/services/product.service';
import { mapGetters } from 'vuex';

export default {
  name: 'HomeView',
  data() {
    return {
      featuredProducts: [],
      loading: true
    };
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'currentUser'])
  },
  created() {
    this.fetchFeaturedProducts();
  },
  methods: {
    async fetchFeaturedProducts() {
      try {
        const response = await ProductService.getAll({ featured: true, limit: 3 });
        this.featuredProducts = response.data.data;
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    }
  }
};
</script>

<style scoped>
.hero-section {
  margin-bottom: 2rem;
  padding: 3rem 0;
}

.hero-image {
  max-height: 400px;
  object-fit: contain;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.display-4 {
  color: #333;
  line-height: 1.2;
}

.featured-products {
  margin-bottom: 2rem;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>
