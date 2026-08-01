import axiosClient from '../axiosClient';

/**
 * Get users list for administrator.
 * @param {Object} [params] - Filtering & pagination parameters.
 * @returns {Promise<Object>} The response data.
 */
export async function getAdminUsers(params) {
  const response = await axiosClient.get('/admin/users', { params });
  return response.data;
}

/**
 * Update role of a specific user.
 * @param {string|number} id - User ID.
 * @param {string} role - New user role.
 * @returns {Promise<Object>} The response data.
 */
export async function updateUserRole(id, role) {
  const response = await axiosClient.patch(`/admin/users/${id}/role`, { role });
  return response.data;
}
