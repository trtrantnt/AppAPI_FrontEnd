<template>
  <div class="categories-admin">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Quản lý danh mục</h1>
      <button class="btn btn-primary" @click="openModal()">
        <i class="bi bi-plus-circle me-2"></i> Thêm danh mục mới
      </button>
    </div>

    <!-- Alert Messages -->
    <div 
      v-if="alertMessage" 
      class="alert" 
      :class="`alert-${alertType}`" 
      style="position: fixed; top: 20px; right: 20px; z-index: 9999;"
    >
      {{ alertMessage }}
      <button type="button" class="btn-close float-end" @click="clearAlert"></button>
    </div>

    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-3">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>
        <div v-else-if="categories.length === 0" class="text-center py-3">
          <p class="text-muted">Chưa có danh mục nào.</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Slug</th>
                <th>Số sản phẩm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categories" :key="category._id">
                <td>{{ category.name }}</td>
                <td>{{ category.description || 'Không có mô tả' }}</td>
                <td>{{ category.slug }}</td>
                <td>{{ category.productCount || 0 }}</td>
                <td>
                  <div class="btn-group">
                    <button 
                      type="button" 
                      class="btn btn-sm btn-primary" 
                      @click="openModal(category)"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-sm btn-danger" 
                      @click="confirmDelete(category)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div class="modal fade" id="categoryModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Cập nhật danh mục' : 'Thêm danh mục mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCategory">
              <div class="mb-3">
                <label for="categoryName" class="form-label">Tên danh mục <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="categoryName" 
                  v-model="currentCategory.name" 
                  :class="{ 'is-invalid': validationErrors.name }"
                  required
                >
                <div class="invalid-feedback" v-if="validationErrors.name">
                  {{ validationErrors.name }}
                </div>
              </div>
              <div class="mb-3">
                <label for="categoryDescription" class="form-label">Mô tả</label>
                <textarea 
                  class="form-control" 
                  id="categoryDescription" 
                  v-model="currentCategory.description"
                  rows="3"
                ></textarea>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Hủy
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="modalLoading"
                >
                  <span v-if="modalLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                  {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa danh mục <strong>{{ currentCategory.name }}</strong>?</p>
            <p class="text-danger">Lưu ý: Thao tác này không thể hoàn tác.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-danger" @click="deleteCategory" :disabled="modalLoading">
              <span v-if="modalLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>
              Xác nhận xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryService from '@/services/category.service';
import ProductService from '@/services/product.service';
import { Modal } from 'bootstrap';

export default {
  name: 'CategoriesView',
  data() {
    return {
      categories: [],
      currentCategory: {
        _id: null,
        name: '',
        description: '',
        slug: '',
        productCount: 0
      },
      loading: true,
      modalLoading: false,
      isEditing: false,
      categoryModal: null,
      deleteModal: null,
      alertMessage: '',
      alertType: 'success',
      alertTimeout: null,
      validationErrors: {}
    };
  },
  created() {
    this.fetchCategories();
  },
  mounted() {
    this.categoryModal = new Modal(document.getElementById('categoryModal'));
    this.deleteModal = new Modal(document.getElementById('deleteModal'));
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      try {
        // Add debugging for network requests
        console.log('Starting category fetch process');
        
        // First try to get categories with product counts from backend
        let response;
        try {
          console.log('Attempting to fetch categories with product count');
          response = await CategoryService.getCategoriesWithProductCount();
          console.log('Categories response with count:', response);
        } catch (countError) {
          console.warn('Could not fetch categories with product count:', countError);
          // Fall back to regular categories endpoint
          console.log('Falling back to regular categories endpoint');
          response = await CategoryService.getAll();
          console.log('Fallback categories response:', response);
        }
        
        // Process the response data with detailed logging
        console.log('Raw response:', response);
        let categoriesData = [];
        if (response && response.data) {
          console.log('Response data structure:', {
            hasSuccess: 'success' in response.data,
            hasData: 'data' in response.data,
            isDataArray: response.data.data && Array.isArray(response.data.data),
            isResponseArray: Array.isArray(response.data)
          });
          
          if (response.data.success && Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
          } else if (Array.isArray(response.data)) {
            categoriesData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
          }
        }
        
        console.log('Extracted categories data:', categoriesData);
        
        // Prepare categories with initial values
        this.categories = categoriesData.map(category => ({
          _id: category._id || category.id,
          name: category.name || 'Không tên',
          description: category.description || '',
          slug: category.slug || '',
          productCount: category.productCount || 0
        }));
        
        // If backend doesn't provide product counts, get them manually
        if (this.categories.every(cat => !cat.productCount)) {
          await this.fetchProductCountForCategories();
        }
        
        console.log('Final processed categories:', this.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.showAlert(`Không thể tải danh sách danh mục: ${error.message}`, 'danger');
      } finally {
        this.loading = false;
      }
    },
    
    // Count products for each category
    async fetchProductCountForCategories() {
      try {
        // Get all products
        const productsResponse = await ProductService.getAll({ limit: 1000 });
        let allProducts = [];
        
        if (productsResponse && productsResponse.data) {
          if (productsResponse.data.data && Array.isArray(productsResponse.data.data)) {
            allProducts = productsResponse.data.data;
          } else if (Array.isArray(productsResponse.data)) {
            allProducts = productsResponse.data;
          }
        }
        
        // Count products for each category
        const categoryCounts = {};
        allProducts.forEach(product => {
          const categoryId = product.category?._id || product.category;
          if (categoryId) {
            categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
          }
        });
        
        // Update our categories with the counts
        this.categories = this.categories.map(category => ({
          ...category,
          productCount: categoryCounts[category._id] || 0
        }));
        
        console.log('Categories with product counts:', this.categories);
      } catch (error) {
        console.error('Error counting products for categories:', error);
      }
    },
    
    openModal(category = null) {
      this.validationErrors = {};
      
      if (category) {
        this.currentCategory = { ...category };
        this.isEditing = true;
      } else {
        this.currentCategory = {
          _id: null,
          name: '',
          description: '',
          slug: '',
          productCount: 0
        };
        this.isEditing = false;
      }
      
      this.categoryModal.show();
    },
    
    confirmDelete(category) {
      this.currentCategory = { ...category };
      this.deleteModal.show();
    },
    
    validateForm() {
      this.validationErrors = {};
      let isValid = true;
      
      if (!this.currentCategory.name.trim()) {
        this.validationErrors.name = 'Tên danh mục không được để trống';
        isValid = false;
      }
      
      return isValid;
    },
    
    async saveCategory() {
      if (!this.validateForm()) return;
      
      this.modalLoading = true;
      
      try {
        const categoryData = {
          name: this.currentCategory.name,
          description: this.currentCategory.description || ''
        };
        
        if (this.isEditing) {
          await CategoryService.update(this.currentCategory._id, categoryData);
          this.showAlert('Cập nhật danh mục thành công', 'success');
        } else {
          await CategoryService.create(categoryData);
          this.showAlert('Thêm danh mục thành công', 'success');
        }
        
        this.categoryModal.hide();
        await this.fetchCategories();
      } catch (error) {
        console.error('Error saving category:', error);
        const errorMessage = error.response?.data?.message || 'Không thể lưu danh mục';
        
        if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('duplicate')) {
          this.validationErrors.name = 'Tên danh mục đã tồn tại';
        } else {
          this.showAlert(errorMessage, 'danger');
        }
      } finally {
        this.modalLoading = false;
      }
    },
    
    async deleteCategory() {
      this.modalLoading = true;
      
      try {
        await CategoryService.delete(this.currentCategory._id);
        this.deleteModal.hide();
        this.showAlert('Xóa danh mục thành công', 'success');
        await this.fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        this.showAlert(error.response?.data?.message || 'Không thể xóa danh mục', 'danger');
      } finally {
        this.modalLoading = false;
      }
    },
    
    showAlert(message, type = 'success') {
      // Clear any existing timeout
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
      
      this.alertMessage = message;
      this.alertType = type;
      
      this.alertTimeout = setTimeout(() => {
        this.alertMessage = '';
      }, 5000);
    },
    
    clearAlert() {
      this.alertMessage = '';
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
    }
  }
};
</script>

<style scoped>
.categories-admin {
  position: relative;
}

.table th, .table td {
  vertical-align: middle;
}

.btn-group .btn {
  margin-right: 5px;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.invalid-feedback {
  display: block;
}
</style>