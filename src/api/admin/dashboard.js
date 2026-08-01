import axiosClient from '../axiosClient';

/**
 * Get administrator dashboard statistics.
 * @returns {Promise<Object>} The response data.
 */
export async function getDashboardStats() {
  const response = await axiosClient.get('/admin/dashboard/stats');
  return response.data;
}
