<!-- src/views/admin/Products.vue -->
<template>
    <div class="admin-products">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Quản lý sản phẩm</h1>
        <button class="btn btn-primary" @click="openProductModal()">
          <i class="bi bi-plus"></i> Thêm sản phẩm
        </button>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="7" class="text-center py-3">Đang tải...</td>
                </tr>
                <tr v-else-if="products.length === 0">
                  <td colspan="7" class="text-center py-3">Không có sản phẩm nào</td>
                </tr>
                <tr v-for="(product, index) in products" :key="product._id">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <img
                      :src="product.image ? `http://localhost:4000/${product.image}` : '/placeholder.jpg'"
                      alt=""
                      width="50"
                      height="50"
                      class="img-thumbnail"
                    />
                  </td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.category?.name || 'N/A' }}</td>
                  <td>{{ formatPrice(product.price) }}</td>
                  <td>{{ formatDate(product.created_at) }}</td>
                  <td>
                    <div class="btn-group">
                      <button 
                        class="btn btn-sm btn-primary"
                        @click="openProductModal(product)"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-danger" 
                        @click="confirmDelete(product._id)"
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
      
      <!-- Product Modal -->
      <div class="modal fade" id="productModal" tabindex="-1" ref="productModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm' }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Product Form -->
              <form @submit.prevent="saveProduct">
                <!-- Form fields -->
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModal">
        <!-- Modal content -->
      </div>
    </div>
  </template>
  
  <script>
  import ProductService from '@/services/product.service';
  import CategoryService from '@/services/category.service';
  import { Modal } from 'bootstrap';
  
  export default {
    name: 'AdminProducts',
    data() {
      return {
        products: [],
        categories: [],
        loading: true,
        editingProduct: null,
        productModal: null,
        deleteModal: null,
        productToDelete: null,
        formData: {
          name: '',
          category: '',
          price: 0,
          description: '',
          image: null
        }
      };
    },
    mounted() {
      this.fetchProducts();
      this.fetchCategories();
      this.productModal = new Modal(this.$refs.productModal);
      this.deleteModal = new Modal(this.$refs.deleteModal);
    },
    methods: {
      async fetchProducts() {
        this.loading = true;
        try {
          const response = await ProductService.getAll();
          this.products = response.data.data;
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          this.loading = false;
        }
      },
      async fetchCategories() {
        try {
          const response = await CategoryService.getAll();
          this.categories = response.data.data;
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      },
      openProductModal(product = null) {
        this.editingProduct = product;
        
        if (product) {
          this.formData = {
            name: product.name,
            category: product.category?._id || '',
            price: product.price,
            description: product.description || '',
            image: null
          };
        } else {
          this.formData = {
            name: '',
            category: '',
            price: 0,
            description: '',
            image: null
          };
        }
        
        this.productModal.show();
      },
      async saveProduct() {
        try {
          // Tạo FormData object để upload file
          const formData = new FormData();
          formData.append('name', this.formData.name);
          formData.append('price', this.formData.price);
          formData.append('category', this.formData.category);
          formData.append('description', this.formData.description);
          
          if (this.formData.image) {
            formData.append('image', this.formData.image);
          }
          
          if (this.editingProduct) {
            await ProductService.update(this.editingProduct._id, formData);
          } else {
            await ProductService.create(formData);
          }
          
          this.productModal.hide();
          this.fetchProducts();
        } catch (error) {
          console.error('Error saving product:', error);
        }
      },
      confirmDelete(id) {
        this.productToDelete = id;
        this.deleteModal.show();
      },
      async deleteProduct() {
        try {
          await ProductService.delete(this.productToDelete);
          this.deleteModal.hide();
          this.fetchProducts();
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      },
      handleImageChange(event) {
        this.formData.image = event.target.files[0];
      },
      formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(price);
      },
      formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
      }
    }
  };
  </script>