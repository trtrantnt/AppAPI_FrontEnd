<template>
  <div class="home">
    <section class="hero-section py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="display-4">Chào mừng đến với E-Commerce</h1>
            <p class="lead">Khám phá các sản phẩm chất lượng cao với giá tốt nhất trên thị trường.</p>
            <router-link to="/products" class="btn btn-primary btn-lg">
              Mua sắm ngay
            </router-link>
          </div>
          <div class="col-md-6">
            <img 
              src="https://placeholder.pics/svg/600x400/DEDEDE/555555/Shopping%20Image" 
              alt="Shopping" 
              class="img-fluid rounded" 
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

export default {
  name: 'HomeView',
  data() {
    return {
      featuredProducts: [],
      loading: true
    };
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
  margin-bottom: 20px;
}
.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>
