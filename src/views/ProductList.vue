<template>
  <div class="product-list">
    <h1>Sản phẩm</h1>

    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm sản phẩm..."
            v-model="searchQuery"
            @input="debounceSearch"
          />
          <button class="btn btn-outline-secondary" @click="searchProducts">
            <i class="bi bi-search"></i> Tìm kiếm
          </button>
        </div>
      </div>

      <div class="col-md-6">
        <div class="d-flex justify-content-end">
          <select class="form-select w-auto" v-model="selectedCategory" @change="filterProducts">
            <option value="">Tất cả danh mục</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="!products || products.length === 0" class="text-center py-5">
      <p>Không tìm thấy sản phẩm nào.</p>
    </div>

    <div v-else class="row">
      <div v-for="product in products" :key="product._id" class="col-md-4 mb-4">
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
</template>

<script>
import ProductService from '@/services/product.service';
import CategoryService from '@/services/category.service';
import { debounce } from 'lodash';

export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      categories: [],
      loading: true,
      searchQuery: '',
      selectedCategory: '',
      page: 1,
      totalPages: 0
    };
  },
  created() {
    this.fetchProducts();
    this.fetchCategories();
    this.debounceSearch = debounce(this.searchProducts, 500);
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
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

        const response = await ProductService.getAll(params);
        
        // Handle the case where response might be empty or malformed
        if (response && response.data && response.data.data) {
          this.products = response.data.data;
          this.totalPages = response.data.totalPages || 1;
        } else {
          this.products = [];
          this.totalPages = 0;
          console.warn('Received unexpected response format when fetching products', response);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        this.products = []; // Set to empty array on error
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },
    async fetchCategories() {
      try {
        const response = await CategoryService.getAll();
        
        // Ensure categories is always an array
        if (response && response.data && response.data.data) {
          this.categories = response.data.data;
        } else {
          this.categories = [];
          console.warn('Received unexpected response format when fetching categories', response);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.categories = []; // Set to empty array on error
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
.product-list {
  margin-bottom: 30px;
}
.card-img-top {
  height: 200px;
  object-fit: cover;
}
.pagination-container {
  margin-top: 2rem;
}
.pagination-btn {
  margin: 0 0.25rem;
  min-width: 40px;
}
.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}
</style>