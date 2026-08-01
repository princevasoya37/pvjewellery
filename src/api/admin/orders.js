import axiosClient from '../axiosClient';

/**
 * Get orders list for administrator.
 * @param {Object} [params] - Filtering & pagination parameters.
 * @returns {Promise<Object>} The response data.
 */
export async function getAdminOrders(params) {
  const response = await axiosClient.get('/admin/orders', { params });
  return response.data;
}

/**
 * Get details of a single order by ID (Admin).
 * @param {string|number} id
 * @returns {Promise<Object>} The response data.
 */
export async function getAdminOrderById(id) {
  const response = await axiosClient.get(`/admin/orders/${id}`);
  return response.data;
}

/**
 * Update the status and tracking number of an order.
 * @param {string|number} id
 * @param {Object} payload
 * @param {string} payload.status - New order status.
 * @param {string} [payload.trackingNumber] - Tracking number if shipped.
 * @returns {Promise<Object>} The response data.
 */
export async function updateOrderStatus(id, payload) {
  const response = await axiosClient.patch(`/admin/orders/${id}/status`, payload);
  return response.data;
}

/**
 * Refund an order.
 * @param {string|number} id
 * @returns {Promise<Object>} The response data.
 */
export async function refundOrder(id) {
  const response = await axiosClient.post(`/admin/orders/${id}/refund`);
  return response.data;
}
