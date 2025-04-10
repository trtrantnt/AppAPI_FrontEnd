<template>
  <div class="cart-container">
    <h1>Shopping Cart</h1>
    <div v-if="cart.length === 0" class="empty-cart">
      <p>Your cart is empty</p>
      <router-link to="/" class="btn btn-primary">Continue Shopping</router-link>
    </div>
    <div v-else>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.id">
              <td>{{ item.name }}</td>
              <td>${{ item.price.toFixed(2) }}</td>
              <td>
                <div class="quantity-control">
                  <button @click="decreaseQuantity(item)" class="btn btn-sm btn-secondary">-</button>
                  <span class="mx-2">{{ item.quantity }}</span>
                  <button @click="increaseQuantity(item)" class="btn btn-sm btn-secondary">+</button>
                </div>
              </td>
              <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
              <td>
                <button @click="removeFromCart(item.id)" class="btn btn-sm btn-danger">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="cart-summary">
        <div class="row justify-content-end">
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Cart Summary</h5>
                <p>Total Items: {{ totalItems }}</p>
                <p>Subtotal: ${{ subtotal.toFixed(2) }}</p>
                <button @click="checkout" class="btn btn-primary w-100">Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ShoppingCart',
  computed: {
    ...mapGetters(['getCart']),
    cart() {
      return this.getCart
    },
    totalItems() {
      return this.cart.reduce((total, item) => total + item.quantity, 0)
    },
    subtotal() {
      return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }
  },
  methods: {
    ...mapMutations(['removeFromCart']),
    increaseQuantity(item) {
      item.quantity += 1
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity -= 1
      }
    },
    checkout() {
      alert('Checkout functionality will be implemented soon!')
      // Here you'd redirect to a checkout page or process
    }
  }
}
</script>

<style scoped>
.cart-container {
  padding: 20px;
}
.empty-cart {
  text-align: center;
  padding: 50px 0;
}
.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-summary {
  margin-top: 30px;
}
</style>
