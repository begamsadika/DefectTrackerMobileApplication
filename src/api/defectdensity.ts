import axios from 'axios';

export const getDefectDensity = async (projectId: number | string) => {
  try {
    const response = await axios.get(`http://10.0.2.2:3000/api/dashboard/defect-density/${projectId}`);
    console.log(`Defect Density Response for Project ${projectId}:`, response.data);
    console.log('Success:', response.data.message);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error fetching defect density for project ${projectId}:`, error.response.data.message || error.message);
    } else if (error instanceof Error) {
      console.error(`Error fetching defect density for project ${projectId}:`, error.message);
    } else {
      console.error(`Error fetching defect density for project ${projectId}: An unknown error occurred`);
    }
    throw error;
  }
};
