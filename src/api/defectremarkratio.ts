import axios from 'axios';

export const getDefectRemarkRatio = async (projectId: number | string) => {
  try {
    const response = await axios.get(`http://192.168.1.77:3000/api/dashboard/defect-to-remark-ratio/${projectId}`);
    console.log(`Defect to Remark Ratio Response for Project ${projectId}:`, response.data);
    console.log('Success:', response.data.message);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error fetching defect to remark ratio for project ${projectId}:`, error.response.data.message || error.message);
    } else if (error instanceof Error) {
      console.error(`Error fetching defect to remark ratio for project ${projectId}:`, error.message);
    } else {
      console.error(`Error fetching defect to remark ratio for project ${projectId}: An unknown error occurred`);
    }
    throw error;
  }
};
