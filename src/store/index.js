import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';
import wishlistReducer from './wishlistSlice';
import themeReducer from './themeSlice';

const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productsReducer,
  wishlist: wishlistReducer,
  theme: themeReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    // Preserve user theme preference on logout, reset all other user data state
    const theme = state?.theme;
    state = {
      theme,
    };
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

