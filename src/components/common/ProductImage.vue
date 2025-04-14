<template>
  <div class="product-image-container" :class="[size, { 'loading': isLoading }]">
    <img
      v-if="!hasError"
      :src="imageUrl"
      :alt="alt"
      class="product-image"
      :class="{ 'img-fluid': responsive, 'rounded': rounded }"
      @load="handleImageLoaded"
      @error="handleImageError"
    />
    <div v-if="isLoading" class="image-loading">
      <div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
    <div v-if="hasError" class="image-error">
      <i class="bi bi-image text-muted"></i>
    </div>
  </div>
</template>

<script>
import ImageService from '@/services/image.service';

export default {
  name: 'ProductImage',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: 'Hình ảnh sản phẩm'
    },
    responsive: {
      type: Boolean,
      default: true
    },
    rounded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  },
  data() {
    return {
      isLoading: true,
      hasError: false
    };
  },
  computed: {
    imageUrl() {
      return ImageService.getImageUrl(this.src);
    }
  },
  methods: {
    handleImageLoaded() {
      this.isLoading = false;
    },
    handleImageError() {
      this.isLoading = false;
      this.hasError = true;
    }
  }
}
</script>

<style scoped>
.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image-container.loading {
  background-color: #f8f9fa;
}

.image-loading, .image-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.image-error i {
  font-size: 2rem;
}

/* Kích thước ảnh */
.small .product-image {
  height: 50px;
  width: 50px;
  object-fit: cover;
}

.medium .product-image {
  height: 200px;
  object-fit: cover;
}

.large .product-image {
  height: 400px;
  object-fit: contain;
}
</style>
