import axiosClient from './axiosClient';

/**
 * Get reviews for a specific product by slug.
 * @param {string} slug
 * @returns {Promise<Object>} The response data.
 */
export async function getReviews(slug) {
  const response = await axiosClient.get(`/products/${slug}/reviews`);
  return response.data;
}

/**
 * Add a review for a specific product by slug.
 * @param {string} slug
 * @param {Object} payload
 * @param {number} payload.rating
 * @param {string} payload.title
 * @param {string} payload.body
 * @returns {Promise<Object>} The response data.
 */
export async function addReview(slug, payload) {
  const response = await axiosClient.post(`/products/${slug}/reviews`, payload);
  return response.data;
}

/**
 * Update an existing review by ID.
 * @param {string|number} id - Review ID.
 * @param {Object} payload
 * @param {number} [payload.rating]
 * @param {string} [payload.title]
 * @param {string} [payload.body]
 * @returns {Promise<Object>} The response data.
 */
export async function updateReview(id, payload) {
  const response = await axiosClient.patch(`/reviews/${id}`, payload);
  return response.data;
}

/**
 * Delete a review by ID.
 * @param {string|number} id - Review ID.
 * @returns {Promise<Object>} The response data.
 */
export async function deleteReview(id) {
  const response = await axiosClient.delete(`/reviews/${id}`);
  return response.data;
}
