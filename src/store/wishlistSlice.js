import { createSlice } from '@reduxjs/toolkit';

const loadWishlist = () => {
  try {
    const s = localStorage.getItem('wishlist');
    if (s) return JSON.parse(s);
  } catch (_) {}
  return [];
};

const saveWishlist = (items) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(items));
  } catch (_) {}
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlist(),
    isOpen: false,
  },
  reducers: {
    toggleWishlistItem(state, { payload }) {
      const { _id, name, price, images, slug } = payload;
      const existingIndex = state.items.findIndex((i) => i._id === _id);
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push({ _id, name, price, images, slug });
      }
      saveWishlist(state.items);
    },
    removeWishlistItem(state, { payload }) {
      state.items = state.items.filter((i) => i._id !== payload);
      saveWishlist(state.items);
    },
    toggleWishlistDrawer(state) {
      state.isOpen = !state.isOpen;
    },
    setWishlistDrawer(state, { payload }) {
      state.isOpen = payload;
    },
  },
});

export const { toggleWishlistItem, removeWishlistItem, toggleWishlistDrawer, setWishlistDrawer } = wishlistSlice.actions;
export const selectWishlistItems = (s) => s.wishlist.items;
export const selectIsWishlistOpen = (s) => s.wishlist.isOpen;
export default wishlistSlice.reducer;
