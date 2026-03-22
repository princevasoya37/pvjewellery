import { createSlice } from '@reduxjs/toolkit';
import * as productsApi from '../api/products';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    filters: {
      search: '',
      type: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      cut: '',
      color: '',
      clarity: '',
      caratMin: '',
      caratMax: '',
      shape: '',
      metal: '',
      inStock: '',
      sort: 'newest',
    },
    currentProduct: null,
    categories: [],
    collections: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFilters(state, { payload }) {
      state.filters = { ...state.filters, ...payload };
    },
    setCurrentProduct(state, { payload }) {
      state.currentProduct = payload;
    },
    setListResult(state, { payload }) {
      state.list = payload.items || [];
      state.pagination = payload.pagination || state.pagination;
    },
    setCategories(state, { payload }) {
      state.categories = payload;
    },
    setCollections(state, { payload }) {
      state.collections = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload ?? true;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
  },
});

export const {
  setFilters,
  setCurrentProduct,
  setListResult,
  setCategories,
  setCollections,
  setLoading,
  setError,
} = productsSlice.actions;

export const fetchProducts = (params = {}) => async (dispatch, getState) => {
  const { filters } = getState().products;
  const query = { ...filters, ...params };
  const clean = {};
  Object.keys(query).forEach((k) => {
    if (query[k] !== '' && query[k] != null) clean[k] = query[k];
  });
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const data = await productsApi.getProducts(clean);
    dispatch(setListResult(data));
    return data;
  } catch (err) {
    dispatch(setError(err.response?.data?.message || 'Failed to load products'));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchProductBySlug = (slug) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setCurrentProduct(null));
  dispatch(setError(null));
  try {
    const product = await productsApi.getProductBySlug(slug);
    dispatch(setCurrentProduct(product));
    return product;
  } catch (err) {
    dispatch(setError(err.response?.data?.message || 'Product not found'));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    const data = await productsApi.getCategories();
    dispatch(setCategories(data));
    return data;
  } catch (_) {}
};

export const fetchCollections = () => async (dispatch) => {
  try {
    const data = await productsApi.getCollections();
    dispatch(setCollections(data));
    return data;
  } catch (_) {}
};

export default productsSlice.reducer;
