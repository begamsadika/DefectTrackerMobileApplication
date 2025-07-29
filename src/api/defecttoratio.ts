import axios from 'axios';

// Use process.env to access environment variables
const BASE_URL = process.env.VITE_BASE_URL || '';
/**
 * Fetches defect remark ratio for a given project ID.
 * @param projectId The ID of the project
 * @returns Promise resolving to the API response
 */
export const getDefectRemarkRatio = async (projectId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/defect-remark-ratio`, {
      params: { projectId },
    });
    if (response.data && response.data.data) {
      if (Array.isArray(response.data.data)) {
        console.log('Defect remark ratio integration success:', response.data.message || 'Success');
        return response.data.data;
      } else if (typeof response.data.data === 'object') {
        console.log('Defect remark ratio integration success (object):', response.data.message || 'Success');
        return [response.data.data];
      }
    }
    console.warn('API response does not contain a defect remark ratio array or object:', response.data);
    return [];
  } catch (error) {
    console.error('Defect remark ratio integration error:', error);
    return [];
  }
};
