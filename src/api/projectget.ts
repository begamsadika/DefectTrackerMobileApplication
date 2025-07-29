import axios from 'axios';
import { Project } from '../type';
import { VITE_BASE_URL } from '@env';


export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${VITE_BASE_URL}projects`);
    console.log('Full API response:', response.data);
    // Handle array in response.data.data
    if (response.data && Array.isArray(response.data.data)) {
      console.log('Projects integration success:', response.data.message || 'Success');
      return response.data.data;
    } else {
      console.warn('API response does not contain a projects array:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Projects integration error:', error);
    return [];
  }
};
