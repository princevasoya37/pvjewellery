import axiosClient from './axiosClient';

/**
 * Get products list with query params.
 * @param {Object} [params]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {string} [params.sort]
 * @param {string} [params.search]
 * @param {string} [params.category]
 * @param {string} [params.type]
 * @param {number} [params.minPrice]
 * @param {number} [params.maxPrice]
 * @param {string} [params.cut]
 * @param {string} [params.color]
 * @param {string} [params.clarity]
 * @param {number} [params.caratMin]
 * @param {number} [params.caratMax]
 * @param {string} [params.shape]
 * @param {string} [params.metal]
 * @param {boolean} [params.inStock]
 * @returns {Promise<Object>} The response data.
 */
export async function getProducts(params) {
  const response = await axiosClient.get('/products', { params });
  return response.data;
}

/**
 * Get a single product details by slug.
 * @param {string} slug
 * @returns {Promise<Object>} The response data.
 */
export async function getProductBySlug(slug) {
  const response = await axiosClient.get(`/products/${slug}`);
  return response.data;
}

/**
 * Get product categories list.
 * @returns {Promise<Object>} The response data.
 */
export async function getCategories() {
  const response = await axiosClient.get('/products/categories');
  return response.data;
}

/**
 * Get collections list.
 * @returns {Promise<Object>} The response data.
 */
export async function getCollections() {
  const response = await axiosClient.get('/products/collections');
  return response.data;
}
