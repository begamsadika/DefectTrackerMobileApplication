import axios from 'axios';

const BASE_URL = process.env.VITE_BASE_URL || '';

/**
 * Fetches the Defect Severity Index (DSI) for a given project ID.
 * @param projectId The ID of the project
 * @returns Promise resolving to the API response
 */
export const getSeverityIndex = async (projectId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/dsi/${projectId}`);
    if (response.data && response.data.data) {
      if (Array.isArray(response.data.data)) {
        console.log('Severity index integration success:', response.data.message || 'Success');
        return response.data.data;
      } else if (typeof response.data.data === 'object') {
        console.log('Severity index integration success (object):', response.data.message || 'Success');
        return [response.data.data];
      }
    }
    console.warn('API response does not contain a severity index array or object:', response.data);
    return [];
  } catch (error) {
    console.error('Severity index integration error:', error);
    return [];
  }
};
