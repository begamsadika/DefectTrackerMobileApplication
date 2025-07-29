/**
 * @format
 */

import { getDefectRemarkRatio } from '../src/api/defecttoratio';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Defect Remark Ratio API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch defect ratio successfully with real API response format', async () => {
    const mockResponse = {
      data: {
        status: 'success',
        message: 'Defect to Remark Ratio fetched successfully',
        data: {
          remarks: 503,
          defects: 493,
          ratio: '98.01%',
          category: 'Low',
          color: 'green',
        },
        statusCode: 2000,
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getDefectRemarkRatio(1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('dashboard/defect-remark-ratio'),
      {
        params: { projectId: 1 },
      }
    );

    expect(result).toEqual({
      ratio: 0.9801,
      percentage: 98.01,
      level: 'Low',
      defectCount: 493,
      remarkCount: 503,
    });
  });

  test('should fetch defect ratio successfully with high category', async () => {
    const mockResponse = {
      data: {
        status: 'success',
        message: 'Defect to Remark Ratio fetched successfully',
        data: {
          remarks: 200,
          defects: 150,
          ratio: '75.00%',
          category: 'High',
          color: 'red',
        },
        statusCode: 2000,
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getDefectRemarkRatio(2);

    expect(result).toEqual({
      ratio: 0.75,
      percentage: 75.0,
      level: 'High',
      defectCount: 150,
      remarkCount: 200,
    });
  });

  test('should handle missing category by defaulting to Unknown', async () => {
    const mockResponse = {
      data: {
        status: 'success',
        message: 'Defect to Remark Ratio fetched successfully',
        data: {
          remarks: 200,
          defects: 30,
          ratio: '15.0%',
          // category is missing
          color: 'green',
        },
        statusCode: 2000,
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getDefectRemarkRatio(3);

    expect(result).toEqual({
      ratio: 0.15,
      percentage: 15.0,
      level: 'Unknown',
      defectCount: 30,
      remarkCount: 200,
    });
  });

  test('should return null when API call fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const result = await getDefectRemarkRatio(1);

    expect(result).toBeNull();
  });

  test('should return null when response data is invalid', async () => {
    const mockResponse = {
      data: {
        message: 'No data available',
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getDefectRemarkRatio(1);

    expect(result).toBeNull();
  });

  test('should handle response with missing ratio field', async () => {
    const mockResponse = {
      data: {
        status: 'success',
        message: 'Defect to Remark Ratio fetched successfully',
        data: {
          remarks: 200,
          defects: 70,
          // ratio field is missing
          category: 'Medium',
          color: 'yellow',
        },
        statusCode: 2000,
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getDefectRemarkRatio(4);

    expect(result).toEqual({
      ratio: 0,
      percentage: 0, // Should default to 0 when ratio is missing
      level: 'Medium',
      defectCount: 70,
      remarkCount: 200,
    });
  });

  test('should handle invalid numeric values gracefully', async () => {
    const mockResponse = {
      data: {
        status: 'success',
        message: 'Defect to Remark Ratio fetched successfully',
        data: {
          remarks: 'not_a_number',
          defects: '',
          ratio: 'invalid%',
          category: null,
          color: 'green',
        },
        statusCode: 2000,
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getDefectRemarkRatio(5);

    expect(result).toEqual({
      ratio: 0,
      percentage: 0,
      level: 'Unknown', // Should default to Unknown when category is null
      defectCount: undefined,
      remarkCount: undefined,
    });
  });

  test('should handle array response format', async () => {
    const mockResponse = {
      data: {
        status: 'success',
        message: 'Defect to Remark Ratio fetched successfully',
        data: [
          {
            remarks: 300,
            defects: 120,
            ratio: '40.00%',
            category: 'Medium',
            color: 'yellow',
          },
        ],
        statusCode: 2000,
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getDefectRemarkRatio(6);

    expect(result).toEqual({
      ratio: 0.4,
      percentage: 40.0,
      level: 'Medium',
      defectCount: 120,
      remarkCount: 300,
    });
  });
});
