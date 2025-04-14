<template>
  <div class="product-detail">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else class="card">
      <div class="row g-0">
        <div class="col-md-6">
          <product-image
            :src="product.image"
            :alt="product.name"
            class="rounded-start product-image"
            size="large"
          />
        </div>
        <div class="col-md-6">
          <div class="card-body">
            <h1 class="card-title">{{ product.name }}</h1>
            <p class="card-text fs-2 fw-bold text-primary">{{ formatPrice(product.price) }}</p>
            <p class="card-text">{{ product.description }}</p>
            
            <div class="mb-3">
              <h5>Danh mục:</h5>
              <span class="badge bg-secondary" v-if="product.category">{{ product.category.name }}</span>
              <span v-else>Không có danh mục</span>
            </div>

            <div class="d-grid gap-2">
              <button class="btn btn-primary btn-lg">Thêm vào giỏ hàng</button>
              <button class="btn btn-outline-secondary btn-lg">Mua ngay</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5">
      <h3>Các sản phẩm liên quan</h3>
      <div v-if="loadingRelated" class="text-center py-3">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>
      <div v-else class="row">
        <div v-for="relatedProduct in relatedProducts" :key="relatedProduct._id" class="col-md-4 mb-4">
          <div class="card h-100">
            <product-image
              :src="relatedProduct.image || relatedProduct.imgURL"
              :alt="relatedProduct.name"
              class="card-img-top"
            />
            <div class="card-body">
              <h5 class="card-title">{{ relatedProduct.name }}</h5>
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">{{ formatPrice(relatedProduct.price) }}</span>
                <router-link :to="`/product/${relatedProduct._id}`" class="btn btn-primary">
                  Xem chi tiết
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductService from '@/services/product.service';
import ProductImage from '@/components/common/ProductImage.vue';

export default {
  name: 'ProductDetail',
  components: {
    ProductImage
  },
  data() {
    return {
      product: {},
      relatedProducts: [],
      loading: true,
      loadingRelated: true,
      error: null
    };
  },
  created() {
    this.fetchProductDetail();
  },
  watch: {
    '$route.params.id'() {
      this.fetchProductDetail();
    }
  },
  methods: {
    async fetchProductDetail() {
      const productId = this.$route.params.id;
      this.loading = true;
      this.error = null;
      
      try {
        const response = await ProductService.getById(productId);
        this.product = response.data.data;
        this.fetchRelatedProducts();
      } catch (error) {
        console.error('Error fetching product details:', error);
        this.error = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },
    async fetchRelatedProducts() {
      if (!this.product.category) {
        this.loadingRelated = false;
        return;
      }
      
      this.loadingRelated = true;
      try {
        const response = await ProductService.getAll({
          category: this.product.category._id,
          limit: 3,
          excludeId: this.product._id
        });
        this.relatedProducts = response.data.data;
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        this.loadingRelated = false;
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
.product-detail {
  margin-bottom: 30px;
}
.product-image {
  max-height: 500px;
  width: 100%;
  object-fit: contain;
}
</style>
