import axios from 'axios';
import { VITE_BASE_URL } from '@env';

export const getProjects = async () => {
  try {
    const response = await axios.get(`${VITE_BASE_URL}projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};
