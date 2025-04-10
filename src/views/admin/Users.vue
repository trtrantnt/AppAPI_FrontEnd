<template>
  <div class="users-admin">
    <h1 class="mb-4">Quản lý người dùng</h1>

    <div class="card">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm người dùng..."
                v-model="searchQuery"
                @input="debounceSearch"
              />
              <button class="btn btn-outline-secondary" @click="searchUsers">
                <i class="bi bi-search"></i> Tìm kiếm
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex justify-content-end">
              <select class="form-select w-auto" v-model="roleFilter" @change="filterUsers">
                <option value="">Tất cả vai trò</option>
                <option value="user">User</option>
                <option value="mod">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="loading" class="text-center py-3">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>
        
        <div v-else-if="users.length === 0" class="text-center py-3">
          <p>Không tìm thấy người dùng nào.</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên</th>
                <th scope="col">Email</th>
                <th scope="col">Vai trò</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="user._id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span 
                    v-for="role in user.roles" 
                    :key="role._id" 
                    class="badge"
                    :class="{
                      'bg-primary': role.name === 'user',
                      'bg-info': role.name === 'mod',
                      'bg-danger': role.name === 'admin'
                    }"
                    style="margin-right: 3px;"
                  >
                    {{ role.name }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="user.active ? 'bg-success' : 'bg-warning'">
                    {{ user.active ? 'Hoạt động' : 'Đã khóa' }}
                  </span>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-sm btn-outline-primary" @click="openUserModal(user)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-sm" 
                      :class="user.active ? 'btn-outline-warning' : 'btn-outline-success'"
                      @click="toggleUserStatus(user)"
                    >
                      <i class="bi" :class="user.active ? 'bi-lock' : 'bi-unlock'"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <nav aria-label="Page navigation" v-if="totalPages > 1">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: page === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(page - 1)">Trước</a>
              </li>
              <li class="page-item" v-for="p in totalPages" :key="p" :class="{ active: p === page }">
                <a class="page-link" href="#" @click.prevent="changePage(p)">{{ p }}</a>
              </li>
              <li class="page-item" :class="{ disabled: page === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(page + 1)">Sau</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- User Edit Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="userModalLabel">Chỉnh sửa thông tin người dùng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateUser">
              <div class="mb-3">
                <label for="userName" class="form-label">Tên người dùng</label>
                <input
                  type="text"
                  class="form-control"
                  id="userName"
                  v-model="currentUser.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="userEmail" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="userEmail"
                  v-model="currentUser.email"
                  required
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Vai trò</label>
                <div class="form-check" v-for="role in availableRoles" :key="role.value">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :id="'role_' + role.value"
                    :value="role.value"
                    v-model="currentUser.roleList"
                  >
                  <label class="form-check-label" :for="'role_' + role.value">
                    {{ role.label }}
                  </label>
                </div>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="userActive" v-model="currentUser.active">
                <label class="form-check-label" for="userActive">Tài khoản hoạt động</label>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
                <button type="submit" class="btn btn-primary" :disabled="modalLoading">
                  <span v-if="modalLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { debounce } from 'lodash';
import UserService from '@/services/user.service';

export default {
  // Fix ESLint warning by using a multi-word component name
  name: 'UsersView',
  data() {
    return {
      users: [],
      currentUser: {
        _id: null,
        name: '',
        email: '',
        roleList: [],
        active: true
      },
      searchQuery: '',
      roleFilter: '',
      page: 1,
      limit: 10,
      totalPages: 0,
      loading: true,
      modalLoading: false,
      userModal: null,
      availableRoles: [
        { value: 'user', label: 'User' },
        { value: 'mod', label: 'Moderator' },
        { value: 'admin', label: 'Admin' }
      ]
    };
  },
  created() {
    this.fetchUsers();
    this.debounceSearch = debounce(this.searchUsers, 500);
  },
  mounted() {
    this.userModal = new Modal(document.getElementById('userModal'));
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const params = {
          page: this.page,
          limit: this.limit
        };
        
        if (this.searchQuery) {
          params.search = this.searchQuery;
        }
        
        if (this.roleFilter) {
          params.role = this.roleFilter;
        }
        
        const response = await UserService.getAll(params);
        this.users = response.data.data;
        this.totalPages = response.data.totalPages || 1;
      } catch (error) {
        console.error('Error fetching users:', error);
        this.$toast.error('Không thể tải danh sách người dùng');
      } finally {
        this.loading = false;
      }
    },
    
    openUserModal(user) {
      // Extract role names to an array for checkboxes
      const roleList = user.roles.map(role => role.name);
      
      this.currentUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        roleList: roleList,
        active: user.active
      };
      
      this.userModal.show();
    },
    
    async updateUser() {
      this.modalLoading = true;
      try {
        await UserService.updateUser(this.currentUser._id, {
          name: this.currentUser.name,
          roles: this.currentUser.roleList,
          active: this.currentUser.active
        });
        
        this.$toast.success('Cập nhật người dùng thành công');
        this.fetchUsers();
        this.userModal.hide();
      } catch (error) {
        console.error('Error updating user:', error);
        this.$toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật người dùng');
      } finally {
        this.modalLoading = false;
      }
    },
    
    async toggleUserStatus(user) {
      try {
        await UserService.updateUser(user._id, {
          active: !user.active
        });
        
        this.$toast.success(`Người dùng đã được ${user.active ? 'khóa' : 'kích hoạt'} thành công`);
        this.fetchUsers();
      } catch (error) {
        console.error('Error toggling user status:', error);
        this.$toast.error('Đã xảy ra lỗi khi thay đổi trạng thái người dùng');
      }
    },
    
    searchUsers() {
      this.page = 1;
      this.fetchUsers();
    },
    
    filterUsers() {
      this.page = 1;
      this.fetchUsers();
    },
    
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchUsers();
      }
    },
    
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    }
  }
};
</script>
