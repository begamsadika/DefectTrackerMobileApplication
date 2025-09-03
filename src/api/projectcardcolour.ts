const API_BASE_URL = 'http://192.168.1.15:3000/api/dashboard';

export interface ProjectCardColor {
  projectName: string;
  severityIndex: string;
  remarkRatio: string;
  densityMeter: string;
  status: string;
  colorCode: string;
}

export const fetchProjectCardColors = async (): Promise<ProjectCardColor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/project-card-summary`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Project Card Colors Response:", data);
    console.log('Success:', data.message);
    return data.data; // Access the 'data' field from the response
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching project card colors:", error.message);
    } else {
      console.error("Error fetching project card colors: An unknown error occurred");
    }
    throw error;
  }
};
