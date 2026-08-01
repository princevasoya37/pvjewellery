import axiosClient from '../axiosClient';

/**
 * Get product list for administrator.
 * @param {Object} [params] - Filtering & pagination parameters.
 * @returns {Promise<Object>} The response data.
 */
export async function getAdminProducts(params) {
  const response = await axiosClient.get('/admin/products', { params });
  return response.data;
}

/**
 * Create a new product.
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function createProduct(payload) {
  const response = await axiosClient.post('/admin/products', payload);
  return response.data;
}

/**
 * Get details of a single product by ID (Admin).
 * @param {string|number} id
 * @returns {Promise<Object>} The response data.
 */
export async function getAdminProductById(id) {
  const response = await axiosClient.get(`/admin/products/${id}`);
  return response.data;
}

/**
 * Update product details by ID.
 * @param {string|number} id
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function updateProduct(id, payload) {
  const response = await axiosClient.put(`/admin/products/${id}`, payload);
  return response.data;
}

/**
 * Delete a product by ID.
 * @param {string|number} id
 * @returns {Promise<Object>} The response data.
 */
export async function deleteProduct(id) {
  const response = await axiosClient.delete(`/admin/products/${id}`);
  return response.data;
}

/**
 * Bulk upload products via multipart/form-data.
 * @param {FormData} formData
 * @returns {Promise<Object>} The response data.
 */
export async function bulkUploadProducts(formData) {
  const response = await axiosClient.post('/admin/products/bulk-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
