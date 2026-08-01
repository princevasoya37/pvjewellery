import axiosClient from '../axiosClient';

/**
 * Get coupons list for administrator.
 * @returns {Promise<Object>} The response data.
 */
export async function getAdminCoupons() {
  const response = await axiosClient.get('/admin/coupons');
  return response.data;
}

/**
 * Create a new discount coupon.
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function createCoupon(payload) {
  const response = await axiosClient.post('/admin/coupons', payload);
  return response.data;
}

/**
 * Update an existing coupon by ID.
 * @param {string|number} id
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function updateCoupon(id, payload) {
  const response = await axiosClient.put(`/admin/coupons/${id}`, payload);
  return response.data;
}

/**
 * Delete a coupon by ID.
 * @param {string|number} id
 * @returns {Promise<Object>} The response data.
 */
export async function deleteCoupon(id) {
  const response = await axiosClient.delete(`/admin/coupons/${id}`);
  return response.data;
}
