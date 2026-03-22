import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const s = localStorage.getItem('cart');
    if (s) return JSON.parse(s);
  } catch (_) {}
  return { items: [], coupon: null };
};

const saveCart = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify({ items: state.items, coupon: state.coupon }));
  } catch (_) {}
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { ...loadCart(), couponCode: '', discount: 0 },
  reducers: {
    addItem(state, { payload }) {
      const { productId, name, price, image, quantity = 1 } = payload;
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, name, price, image, quantity });
      }
      saveCart(state);
    },
    updateQuantity(state, { payload }) {
      const { productId, quantity } = payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      saveCart(state);
    },
    removeItem(state, { payload }) {
      state.items = state.items.filter((i) => i.productId !== payload);
      saveCart(state);
    },
    setCoupon(state, { payload }) {
      state.coupon = payload;
      state.discount = payload?.value ?? 0;
      saveCart(state);
    },
    clearCoupon(state) {
      state.coupon = null;
      state.couponCode = '';
      state.discount = 0;
      saveCart(state);
    },
    setCouponCode(state, { payload }) {
      state.couponCode = payload;
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      state.couponCode = '';
      state.discount = 0;
      saveCart(state);
    },
  },
});

export const {
  addItem,
  updateQuantity,
  removeItem,
  setCoupon,
  clearCoupon,
  setCouponCode,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (s) => s.cart.items;
export const selectCartSubtotal = (s) =>
  s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartDiscount = (s) => s.cart.discount;
export const selectCartTotal = (s) => {
  const sub = selectCartSubtotal(s);
  return Math.max(0, sub - s.cart.discount);
};

export default cartSlice.reducer;
