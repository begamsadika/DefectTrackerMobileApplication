interface DefectReopenCountsResponse {
  status: string;
  message: string;
  statusCode: number;
  projectId: string;
  reopenCounts: {
    [key: string]: number;
  };
}

const API_BASE_URL = 'http://192.168.1.77:3000/api/dashboard';

export const getDefectReopenCounts = async (projectId: string): Promise<DefectReopenCountsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/defect-reopen-counts/${projectId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching defect reopen counts:", error);
    throw error;
  }
};
