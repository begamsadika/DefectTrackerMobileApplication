import axios from 'axios';

const BASE_URL = process.env.VITE_BASE_URL || '';

// Fetch Defect Density for project with id=1
export async function getDefectDensity(projectId: number = 1) {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/defect-density/${projectId}`);
    console.log('Full Defect Density API response:', response.data);
    // Handle expected response structure
    if (response.data && (typeof response.data === 'object' || Array.isArray(response.data))) {
      console.log('Defect Density integration success:', response.data.message || 'Success');
      return response.data;
    } else {
      console.warn('Defect Density API response is not an object/array:', response.data);
      return null;
    }
  } catch (error: any) {
    console.error('Defect Density integration error:', error);
    return null;
  }
}
