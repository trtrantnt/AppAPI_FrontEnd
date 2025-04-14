<template>
  <div class="category-component">
    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else class="row">
      <div v-for="category in categories" :key="category._id" class="col-md-3 mb-4">
        <div class="category-card card h-100">
          <div class="card-body text-center">
            <i class="bi bi-grid-3x3-gap-fill category-icon"></i>
            <h5 class="card-title mt-2">{{ category.name }}</h5>
          </div>
          <div class="card-footer bg-transparent border-0 text-center">
            <router-link :to="`/menu/${category._id}`" class="btn btn-outline-primary btn-sm">
              Xem món ăn
            </router-link>
          </div>
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
        const response = await CategoryService.getAll({ limit: 8 }); // Limit to 8 categories for homepage
        if (response.data && response.data.data) {
          this.categories = response.data.data;
        } else if (Array.isArray(response.data)) {
          this.categories = response.data;
        } else {
          this.categories = [];
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.error = 'Failed to load categories';
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

.category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.category-icon {
  font-size: 2rem;
  color: #0d6efd;
}

.card-title {
  color: #333;
  font-weight: 600;
}

.bi {
  color: #0d6efd;
}
</style>
