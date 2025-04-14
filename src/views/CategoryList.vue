<template>
  <div class="category-list">
    <div class="container py-4">
      <h1 class="mb-4">Danh mục món ăn</h1>
      
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
      <div v-else class="row">
        <div v-for="category in categories" :key="category._id" class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h5 class="card-title">{{ category.name }}</h5>
              <p class="card-text" v-if="category.description">{{ category.description }}</p>
              <router-link 
                :to="`/menu/${category._id}`" 
                class="btn btn-primary"
              >
                Xem món ăn
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- No categories found -->
        <div v-if="categories.length === 0" class="col-12 text-center py-5">
          <p>Không có danh mục món ăn nào.</p>
        </div>
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
        if (response.data && response.data.data) {
          this.categories = response.data.data;
        } else if (Array.isArray(response.data)) {
          this.categories = response.data;
        } else {
          this.categories = [];
          console.warn('Unexpected response format:', response);
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
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card-title {
  font-weight: bold;
  color: #333;
}
</style>
