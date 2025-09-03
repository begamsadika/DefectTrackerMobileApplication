import axios from 'axios';

const API_BASE_URL = 'http://192.168.43.135:3000/api/dashboard';

export interface FilteredProject {
  projectid: number;
  projectname: string;
  projectstatus: string;
  severityIndex: string;
  remarkRatio: string;
  densityMeter: string;
  status: string;
  colorCode: string;
}

export const fetchFilteredProjects = async (status?: string): Promise<FilteredProject[]> => {
  try {
    const url = status ? `${API_BASE_URL}/filter-projects-summary?status=${status}` : `${API_BASE_URL}/filter-projects-summary`;
    const response = await axios.get(url);

    console.log("Filtered Projects Response:", response.data);
    console.log('Success:', response.data.message);

    if (!response.data.data) {
      throw new Error("No data field in response");
    }
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error fetching filtered projects for status ${status || 'all'}:`, error.response.data.message || error.message);
    } else if (error instanceof Error) {
      console.error(`Error fetching filtered projects for status ${status || 'all'}:`, error.message);
    } else {
      console.error(`Error fetching filtered projects for status ${status || 'all'}: An unknown error occurred`);
    }
    throw error;
  }
};
