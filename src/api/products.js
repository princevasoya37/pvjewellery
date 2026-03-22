import api from './client';

export function getProducts(params = {}) {
  return api.get('/products', { params }).then((res) => res.data);
}

export function getProductBySlug(slug) {
  return api.get(`/products/${slug}`).then((res) => res.data);
}

export function getCategories() {
  return api.get('/products/categories').then((res) => res.data);
}

export function getCollections() {
  return api.get('/products/collections').then((res) => res.data);
}
