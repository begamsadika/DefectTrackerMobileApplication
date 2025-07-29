import axios from 'axios';
import { DefectRemarkRatio } from '../type';

// Use process.env to access environment variables
const BASE_URL = process.env.VITE_BASE_URL || '';

/**
 * Fetches defect remark ratio for a given project ID.
 * @param projectId The ID of the project
 * @returns Promise resolving to the defect remark ratio data
 */
export const getDefectRemarkRatio = async (projectId: number): Promise<DefectRemarkRatio | null> => {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/defect-remark-ratio`, {
      params: { projectId },
    });

    if (response.data && response.data.data) {
      const data = response.data.data;
      let ratioData: any;

      if (Array.isArray(data)) {
        ratioData = data[0]; // Take first item if array
      } else if (typeof data === 'object') {
        ratioData = data;
      }

      if (ratioData) {
        console.log('Defect remark ratio integration success:', response.data.message || 'Success');

        // Helper function to safely convert to number or return undefined
        const safeNumber = (value: any): number | undefined => {
          if (value === null || value === undefined || value === '') return undefined;
          const num = Number(value);
          return isNaN(num) ? undefined : num;
        };

        // Helper function to extract percentage from ratio string (e.g., "98.01%" -> 98.01)
        const extractPercentage = (ratioStr: string): number => {
          if (typeof ratioStr === 'string' && ratioStr.includes('%')) {
            const numStr = ratioStr.replace('%', '');
            const num = Number(numStr);
            return isNaN(num) ? 0 : num;
          }
          return Number(ratioStr) || 0;
        };

        // Transform API response to match our interface
        // API returns: { remarks: 503, defects: 493, ratio: "98.01%", category: "Low", color: "green" }
        const percentageValue = extractPercentage(ratioData.ratio || '0%');
        const ratioValue = Math.round((percentageValue / 100) * 10000) / 10000; // Convert percentage to decimal ratio with precision

        // Map API category to our level format
        const mapCategoryToLevel = (category: string): 'High' | 'Medium' | 'Low' | 'Unknown' => {
          if (!category) return 'Unknown';
          const cat = category.toLowerCase();
          if (cat === 'high') return 'High';
          if (cat === 'medium') return 'Medium';
          if (cat === 'low') return 'Low';
          return 'Unknown';
        };

        const ratio: DefectRemarkRatio = {
          ratio: ratioValue,
          percentage: percentageValue,
          level: mapCategoryToLevel(ratioData.category),
          defectCount: safeNumber(ratioData.defects),
          remarkCount: safeNumber(ratioData.remarks),
        };

        return ratio;
      }
    }

    console.warn('API response does not contain valid defect remark ratio data:', response.data);
    return null;
  } catch (error) {
    console.error('Defect remark ratio integration error:', error);
    return null;
  }
};
