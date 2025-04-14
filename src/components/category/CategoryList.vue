<template>
  <div class="category-list">
    <h2 class="mb-4">Danh mục sản phẩm</h2>
    
    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else>
      <div class="list-group">
        <router-link 
          v-for="category in categories" 
          :key="category._id" 
          :to="`/products?category=${category._id}`"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          {{ category.name }}
          <span class="badge bg-primary rounded-pill" v-if="category.productCount">
            {{ category.productCount }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryService from '@/services/category.service';

export default {
  name: 'CategoryList',
  data() {
    return {
      categories: [],
      loading: true,
      error: null
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await CategoryService.getAll();
        if (response.data && Array.isArray(response.data)) {
          this.categories = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          this.categories = response.data.data;
        } else {
          this.categories = [];
          console.warn('Received unexpected response format from categories API');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.error = 'Không thể tải danh sách danh mục. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.category-list {
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.category-list h2 {
  padding: 15px 20px;
  margin-bottom: 0;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  color: #343a40;
  font-size: 1.25rem;
  font-weight: 600;
}

.list-group {
  border-radius: 0;
}

.list-group-item {
  transition: all 0.2s ease;
  padding: 8px 16px;  /* Reduced padding to make buttons smaller */
  border-left: 4px solid transparent;
  font-size: 0.95rem; /* Slightly smaller font size */
}

.list-group-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
  border-left: 4px solid #0d6efd;
}

.list-group-item.active {
  background-color: #e9ecef;
  color: #0d6efd;
  border-color: #0d6efd;
  font-weight: 600;
}

.badge {
  transition: all 0.2s ease;
  background-color: #0d6efd;
  font-size: 0.8rem; /* Smaller badge font size */
  padding: 0.25em 0.6em; /* Smaller badge padding */
}

.list-group-item:hover .badge {
  transform: scale(1.1);
}
</style>
