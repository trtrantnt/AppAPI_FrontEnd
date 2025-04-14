<template>
  <div class="food-items-page">
    <div class="container py-4">
      <h1 class="mb-4">Tất cả món ăn</h1>
      
      <!-- Search and filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Tìm kiếm món ăn..." 
                  v-model="searchQuery"
                  @input="debounceSearch"
                >
                <button class="btn btn-primary" type="button">
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>
            
            <div class="col-md-3">
              <select class="form-select" v-model="selectedCategory" @change="filterProducts">
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category._id" :value="category._id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <div class="col-md-3">
              <select class="form-select" v-model="sortOption" @change="applySorting">
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="name_asc">Tên: A-Z</option>
                <option value="name_desc">Tên: Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>
      
      <!-- Content state -->
      <div v-else>
        <div class="row">
          <div v-for="product in products" :key="product._id" class="col-md-4 mb-4">
            <div class="card h-100 product-card">
              <product-image
                :src="product.image || product.imgURL"
                :alt="product.name"
                class="card-img-top"
              />
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <h5 class="card-title">{{ product.name }}</h5>
                  <span class="badge bg-primary">{{ getCategoryName(product.category) }}</span>
                </div>
                <p class="card-text text-truncate mb-3">{{ product.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold text-primary fs-5">{{ formatPrice(product.price) }}</span>
                  <router-link :to="`/product/${product._id}`" class="btn btn-outline-primary">
                    Xem chi tiết
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No products found -->
          <div v-if="products.length === 0" class="col-12 text-center py-5">
            <p>Không có món ăn nào phù hợp với tìm kiếm của bạn.</p>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="pagination-container d-flex justify-content-center mt-4">
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: page <= 1 }">
                <a class="page-link" href="#" @click.prevent="goToPage(page - 1)">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              
              <li v-for="pageNumber in totalPages" :key="pageNumber" class="page-item" :class="{ active: pageNumber === page }">
                <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                  {{ pageNumber }}
                </a>
              </li>
              
              <li class="page-item" :class="{ disabled: page >= totalPages }">
                <a class="page-link" href="#" @click.prevent="goToPage(page + 1)">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductService from '@/services/product.service';
import CategoryService from '@/services/category.service';
import ProductImage from '@/components/common/ProductImage.vue';
import { debounce } from 'lodash';

export default {
  name: 'FoodItems',
  components: {
    ProductImage
  },
  data() {
    return {
      products: [],
      categories: [],
      categoriesMap: {}, // For quick category name lookup
      loading: true,
      searchQuery: '',
      selectedCategory: '',
      page: 1,
      totalPages: 0,
      sortOption: 'newest',
      error: null
    };
  },
  created() {
    this.debounceSearch = debounce(this.searchProducts, 500);
    this.fetchCategories();
    this.fetchProducts();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await CategoryService.getAll();
        if (response.data && response.data.data) {
          this.categories = response.data.data;
          // Create a map for quick lookups
          this.categories.forEach(category => {
            this.categoriesMap[category._id] = category.name;
          });
        } else if (Array.isArray(response.data)) {
          this.categories = response.data;
          response.data.forEach(category => {
            this.categoriesMap[category._id] = category.name;
          });
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const params = {
          page: this.page,
          limit: 9
        };

        if (this.searchQuery) {
          params.name = this.searchQuery;
        }

        if (this.selectedCategory) {
          params.category = this.selectedCategory;
        }
        
        // Apply sorting
        switch(this.sortOption) {
          case 'name_asc':
            params.sort = 'name';
            break;
          case 'name_desc':
            params.sort = '-name';
            break;
          case 'price_asc':
            params.sort = 'price';
            break;
          case 'price_desc':
            params.sort = '-price';
            break;
          case 'newest':
          default:
            params.sort = '-createdAt';
            break;
        }
        
        const response = await ProductService.getAll(params);
        
        if (response.data) {
          if (response.data.data) {
            this.products = response.data.data;
            this.totalPages = response.data.totalPages || 1;
          } else if (Array.isArray(response.data)) {
            this.products = response.data;
            this.totalPages = 1;
          } else {
            this.products = [];
            this.totalPages = 0;
            console.warn('Received unexpected response format when fetching products', response);
          }
        } else {
          this.products = [];
          this.totalPages = 0;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Không thể tải danh sách món ăn. Vui lòng thử lại sau.';
        this.products = [];
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.page = pageNumber;
        this.fetchProducts();
      }
    },
    searchProducts() {
      this.page = 1;
      this.fetchProducts();
    },
    filterProducts() {
      this.page = 1;
      this.fetchProducts();
    },
    applySorting() {
      this.page = 1;
      this.fetchProducts();
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    },
    getCategoryName(categoryId) {
      if (!categoryId) return 'Chưa phân loại';
      
      // If category is an object with _id
      if (typeof categoryId === 'object' && categoryId._id) {
        return categoryId.name || this.categoriesMap[categoryId._id] || 'Chưa phân loại';
      }
      
      // If category is just the ID
      return this.categoriesMap[categoryId] || 'Chưa phân loại';
    }
  }
};
</script>

<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
}

.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.pagination-container {
  margin-top: 2rem;
}

.badge {
  font-size: 0.7rem;
}
</style>
