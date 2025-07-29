import axios from 'axios';

const BASE_URL = process.env.VITE_BASE_URL || '';

// Fetch project card color code for project with id=1
export async function getProjectCardColor(projectId: number = 1) {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/project-card-color/${projectId}`);
    console.log('Full Project Card Color API response:', response.data);
    // Handle expected response structure
    if (response.data && (typeof response.data === 'object' || Array.isArray(response.data))) {
      console.log('Project Card Color integration success:', response.data.message || 'Success');
      return response.data;
    } else {
      console.warn('Project Card Color API response is not an object/array:', response.data);
      return null;
    }
  } catch (error: any) {
    console.error('Project Card Color integration error:', error);
    return null;
  }
}
