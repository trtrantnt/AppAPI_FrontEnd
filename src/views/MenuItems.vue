<template>
  <div class="menu-items">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>{{ categoryName }}</h1>
        <router-link to="/danh-muc" class="btn btn-outline-primary">
          <i class="bi bi-arrow-left"></i> Quay lại danh mục
        </router-link>
      </div>
      
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
              <select class="form-select" v-model="sortOption" @change="applySorting">
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="name_asc">Tên: A-Z</option>
                <option value="name_desc">Tên: Z-A</option>
              </select>
            </div>
            
            <div class="col-md-3">
              <div class="d-flex justify-content-end">
                <button class="btn btn-secondary me-2" title="Hiển thị dạng lưới">
                  <i class="bi bi-grid"></i>
                </button>
                <button class="btn btn-outline-secondary" title="Hiển thị dạng danh sách">
                  <i class="bi bi-list"></i>
                </button>
              </div>
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
            <div class="card h-100">
              <product-image
                :src="product.image || product.imgURL"
                :alt="product.name"
                class="card-img-top"
              />
              <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text text-truncate">{{ product.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold">{{ formatPrice(product.price) }}</span>
                  <router-link :to="`/product/${product._id}`" class="btn btn-primary">
                    Xem chi tiết
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No products found -->
          <div v-if="products.length === 0" class="col-12 text-center py-5">
            <p>Không có món ăn nào trong danh mục này.</p>
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
  name: 'MenuItems',
  components: {
    ProductImage
  },
  props: {
    categoryId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      products: [],
      categoryName: '',
      loading: true,
      searchQuery: '',
      page: 1,
      totalPages: 0,
      sortOption: 'newest',
      error: null
    };
  },
  watch: {
    categoryId() {
      this.resetAndFetch();
    }
  },
  created() {
    this.debounceSearch = debounce(this.searchProducts, 500);
    this.resetAndFetch();
  },
  methods: {
    resetAndFetch() {
      this.page = 1;
      this.fetchCategoryName();
      this.fetchProducts();
    },
    async fetchCategoryName() {
      try {
        const response = await CategoryService.getById(this.categoryId);
        if (response && response.data && response.data.data) {
          this.categoryName = response.data.data.name;
        } else {
          this.categoryName = 'Danh mục món ăn';
        }
      } catch (error) {
        console.error('Error fetching category details:', error);
        this.categoryName = 'Danh mục món ăn';
      }
    },
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const params = {
          page: this.page,
          limit: 9,
          category: this.categoryId
        };

        if (this.searchQuery) {
          params.name = this.searchQuery;
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
        
        if (response && response.data) {
          if (response.data.data) {
            this.products = response.data.data;
            this.totalPages = response.data.totalPages || 1;
          } else if (Array.isArray(response.data)) {
            this.products = response.data;
            this.totalPages = 1;
          } else {
            this.products = [];
            this.totalPages = 0;
          }
        } else {
          this.products = [];
          this.totalPages = 0;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.';
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
    applySorting() {
      this.page = 1;
      this.fetchProducts();
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
.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.pagination-container {
  margin-top: 2rem;
}
</style>
