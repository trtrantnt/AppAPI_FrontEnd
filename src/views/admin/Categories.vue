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
          <p>Không tìm thấy danh mục nào.</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên danh mục</th>
                <th scope="col">Mô tả</th>
                <th scope="col">Số sản phẩm</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(category, index) in categories" :key="category._id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ category.name }}</td>
                <td>{{ category.description || 'Không có mô tả' }}</td>
                <td>{{ category.productCount || 0 }}</td>
                <td>
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-sm btn-outline-primary" @click="openModal(category)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="confirmDelete(category)">
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
    <div class="modal fade" id="categoryModal" tabindex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="categoryModalLabel">{{ isEditing ? 'Cập nhật danh mục' : 'Thêm danh mục mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCategory">
              <div class="mb-3">
                <label for="categoryName" class="form-label">Tên danh mục</label>
                <input
                  type="text"
                  class="form-control"
                  id="categoryName"
                  v-model="currentCategory.name"
                  required
                />
                <div class="invalid-feedback" v-if="validationErrors.name">
                  {{ validationErrors.name }}
                </div>
              </div>
              <div class="mb-3">
                <label for="categoryDescription" class="form-label">Mô tả</label>
                <textarea
                  class="form-control"
                  id="categoryDescription"
                  rows="3"
                  v-model="currentCategory.description"
                ></textarea>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
                <button type="submit" class="btn btn-primary" :disabled="modalLoading">
                  <span v-if="modalLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Xác nhận xóa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa danh mục <strong>{{ currentCategory.name }}</strong>?</p>
            <p class="text-danger" v-if="currentCategory.productCount > 0">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              Danh mục này hiện đang có {{ currentCategory.productCount }} sản phẩm. Việc xóa danh mục có thể ảnh hưởng đến các sản phẩm này.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteCategory"
              :disabled="modalLoading"
            >
              <span v-if="modalLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryService from '@/services/category.service';
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
        const response = await CategoryService.getAll({ withCount: true });
        this.categories = response.data.data || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.showAlert('Không thể tải danh sách danh mục', 'danger');
      } finally {
        this.loading = false;
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
      } else if (this.currentCategory.name.length < 2) {
        this.validationErrors.name = 'Tên danh mục phải có ít nhất 2 ký tự';
        isValid = false;
      }
      
      return isValid;
    },
    
    async saveCategory() {
      if (!this.validateForm()) {
        return;
      }
      
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
          this.showAlert('Thêm danh mục mới thành công', 'success');
        }
        
        this.fetchCategories();
        this.categoryModal.hide();
      } catch (error) {
        console.error('Error saving category:', error);
        const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi lưu danh mục';
        
        if (error.response?.data?.errors) {
          this.validationErrors = error.response.data.errors;
        }
        
        this.showAlert(errorMessage, 'danger');
      } finally {
        this.modalLoading = false;
      }
    },
    
    async deleteCategory() {
      this.modalLoading = true;
      try {
        await CategoryService.delete(this.currentCategory._id);
        this.showAlert('Xóa danh mục thành công', 'success');
        this.fetchCategories();
        this.deleteModal.hide();
      } catch (error) {
        console.error('Error deleting category:', error);
        this.showAlert(error.response?.data?.message || 'Đã xảy ra lỗi khi xóa danh mục', 'danger');
      } finally {
        this.modalLoading = false;
      }
    },

    showAlert(message, type = 'success') {
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