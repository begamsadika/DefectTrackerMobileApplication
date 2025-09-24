
const API_BASE_URL = 'http://192.168.1.77:3000/api/dashboard';

export const fetchSeveritySummary = async (projectId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/defect-severity-summary/${projectId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching defect severity summary:", error);
    throw error;
  }
};
