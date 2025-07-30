import axios from 'axios';

const BASE_URL = process.env.VITE_BASE_URL || '';

/**
 * Fetch defects by module for a project by ID
 * @param {number|string} projectId
 * @returns {Promise<any>} Defects by module data or null
 */
export async function getDefectsByModule(projectId: number | string) {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/module`, { params: { projectId } });
    console.log('Defects by module API response:', response.data);
    if (response.data && response.data.status === 'success') {
      console.log('Defects by module API call successful. Data received.');
      return response.data.data;
    } else {
      console.warn('Defects by module API returned unexpected response:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Defects by module API error:', error);
    return null;
  }
}
