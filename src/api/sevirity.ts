import axios from 'axios';

const BASE_URL = process.env.VITE_BASE_URL || '';

// Fetch Defect Severity Index (DSI) for project with id=1
export async function getSeverityDSI(projectId: number = 1) {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/dsi/${projectId}`);
    console.log('Full DSI API response:', response.data);
    // Handle expected DSI response structure
    if (response.data && (typeof response.data === 'object' || Array.isArray(response.data))) {
      console.log('DSI integration success:', response.data.message || 'Success');
      return response.data;
    } else {
      console.warn('DSI API response is not an object/array:', response.data);
      return null;
    }
  } catch (error: any) {
    console.error('DSI integration error:', error);
    return null;
  }
}
