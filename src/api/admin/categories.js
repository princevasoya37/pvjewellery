import axiosClient from '../axiosClient';

/**
 * Get categories list for administrator.
 * @returns {Promise<Object>} The response data.
 */
export async function getAdminCategories() {
  const response = await axiosClient.get('/admin/categories');
  return response.data;
}

/**
 * Create a new category.
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function createCategory(payload) {
  const response = await axiosClient.post('/admin/categories', payload);
  return response.data;
}

/**
 * Update an existing category by ID.
 * @param {string|number} id
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function updateCategory(id, payload) {
  const response = await axiosClient.put(`/admin/categories/${id}`, payload);
  return response.data;
}

/**
 * Delete a category by ID.
 * @param {string|number} id
 * @returns {Promise<Object>} The response data.
 */
export async function deleteCategory(id) {
  const response = await axiosClient.delete(`/admin/categories/${id}`);
  return response.data;
}
