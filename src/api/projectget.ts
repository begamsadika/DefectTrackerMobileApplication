import axios from 'axios';

export const getProjects = async () => {
  try {
    const response = await axios.get('http://192.168.43.135:3000/api/projects');
    console.log('Full Axios Response:', response);
    console.log('Response Data:', response.data);
    console.log('Success:', response.data.message); // Log success message
    return response.data; // Return only the projects array
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error fetching projects:', error.response.data.message || error.message);
    } else if (error instanceof Error) {
      console.error('Error fetching projects:', error.message);
    } else {
      console.error('Error fetching projects: An unknown error occurred');
    }
    throw error;
  }
};
