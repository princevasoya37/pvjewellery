import axiosClient from './axiosClient';

/**
 * Create a new checkout order.
 * @param {Object} payload
 * @returns {Promise<Object>} The response data.
 */
export async function createOrder(payload) {
  const response = await axiosClient.post('/orders', payload);
  return response.data;
}

/**
 * Get all orders of current user.
 * @returns {Promise<Object>} The response data.
 */
export async function getMyOrders() {
  const response = await axiosClient.get('/orders');
  return response.data;
}

/**
 * Get details of a single order by ID.
 * @param {string|number} id
 * @returns {Promise<Object>} The response data.
 */
export async function getOrderById(id) {
  const response = await axiosClient.get(`/orders/${id}`);
  return response.data;
}
