import axiosClient from '../axiosClient';

/**
 * Get product reviews list for moderation.
 * @param {string} [status] - Optional moderation status.
 * @returns {Promise<Object>} The response data.
 */
export async function getAdminReviews(status) {
  const params = status ? { status } : {};
  const response = await axiosClient.get('/admin/reviews', { params });
  return response.data;
}

/**
 * Moderate a review (approve/reject/archive).
 * @param {string|number} id - Review ID.
 * @param {string} status - New moderation status.
 * @returns {Promise<Object>} The response data.
 */
export async function moderateReview(id, status) {
  const response = await axiosClient.patch(`/admin/reviews/${id}`, { status });
  return response.data;
}
