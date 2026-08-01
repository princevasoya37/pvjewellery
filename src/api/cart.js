import axiosClient from './axiosClient';

/**
 * Get current user's cart.
 * @returns {Promise<Object>} The response data.
 */
export async function getCart() {
  const response = await axiosClient.get('/cart');
  return response.data;
}

/**
 * Sync or update the user's cart.
 * @param {Array<Object>} items - Array of cart items.
 * @returns {Promise<Object>} The response data.
 */
export async function setCart(items) {
  const response = await axiosClient.put('/cart', { items });
  return response.data;
}

/**
 * Apply coupon code to the cart.
 * @param {string} code
 * @returns {Promise<Object>} The response data.
 */
export async function applyCoupon(code) {
  const response = await axiosClient.post('/cart/coupon', { code });
  return response.data;
}

/**
 * Remove any active coupon from the cart.
 * @returns {Promise<Object>} The response data.
 */
export async function removeCoupon() {
  const response = await axiosClient.delete('/cart/coupon');
  return response.data;
}
