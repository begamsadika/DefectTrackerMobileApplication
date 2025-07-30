import axios from 'axios';

const BASE_URL = process.env.VITE_BASE_URL || '';

/**
 * Fetch defect type data for a project by ID
 * @param {number|string} projectId
 * @returns {Promise<any>} Defect type data or null
 */
export async function getDefectType(projectId: number | string) {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/defect-type/${projectId}`);
    console.log('Defect type API response:', response.data);
    if (response.data && response.data.status === 'success') {
      console.log('Defect type API call successful. Data received.');
      return response.data.data;
    } else {
      console.warn('Defect type API returned unexpected response:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Defect type API error:', error);
    return null;
  }
}
