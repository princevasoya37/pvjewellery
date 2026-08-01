import axiosClient from '../axiosClient';

/**
 * Get banners list for administrator.
 * @returns {Promise<Object>} The response data.
 */
export async function getAdminBanners() {
  const response = await axiosClient.get('/admin/banners');
  return response.data;
}

/**
 * Create a new homepage/promotion banner.
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function createBanner(payload) {
  const response = await axiosClient.post('/admin/banners', payload);
  return response.data;
}

/**
 * Update an existing banner.
 * @param {string|number} id
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function updateBanner(id, payload) {
  const response = await axiosClient.put(`/admin/banners/${id}`, payload);
  return response.data;
}

/**
 * Delete a banner by ID.
 * @param {string|number} id
 * @returns {Promise<Object>} The response data.
 */
export async function deleteBanner(id) {
  const response = await axiosClient.delete(`/admin/banners/${id}`);
  return response.data;
}
