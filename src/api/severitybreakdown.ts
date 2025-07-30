import axios from 'axios';

const BASE_URL = process.env.VITE_BASE_URL || '';

/**
 * Fetch defect severity summary for a project by ID, with error/success logging
 * @param {number|string} projectId
 * @returns {Promise<any[]>} Array of severity summary or []
 */
export async function getDefectSeveritySummary(projectId: number | string) {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/defect_severity_summary/${projectId}`);
    console.log('Full API response:', response.data);
    // Handle both array and object with defectSummary array
    if (response.data && response.data.data) {
      const data = response.data.data;
      if (Array.isArray(data)) {
        console.log('Defect severity summary integration success (array):', response.data.message || 'Success');
        return data;
      } else if (Array.isArray(data.defectSummary)) {
        console.log('Defect severity summary integration success (defectSummary):', response.data.message || 'Success');
        return data.defectSummary;
      }
    }
    console.warn('API response does not contain a severity summary array:', response.data);
    return [];
  } catch (error) {
    console.error('Defect severity summary integration error:', error);
    return [];
  }
}
