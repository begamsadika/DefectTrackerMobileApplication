import axios from 'axios';

export const getDefectSeverityIndex = async (projectId: number | string) => {
  try {
    const response = await axios.get(`http://192.168.1.15:3000/api/dashboard/defect-severity-index/${projectId}`);
    console.log(`Defect Severity Index Response for Project ${projectId}:`, response.data);
    console.log('Success:', response.data.message);
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error fetching defect severity index for project ${projectId}:`, error.response.data.message || error.message);
    } else if (error instanceof Error) {
      console.error(`Error fetching defect severity index for project ${projectId}:`, error.message);
    } else {
      console.error(`Error fetching defect severity index for project ${projectId}: An unknown error occurred`);
    }
    throw error;
  }
};
