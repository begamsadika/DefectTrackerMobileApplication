import { getDefectSeveritySummary } from '../src/api/severitybreakdown';

// Mock axios
jest.mock('axios');

describe('Defect Severity Breakdown Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console logs for clean test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch defect severity summary successfully', async () => {
    const mockAxios = require('axios');
    const mockData = {
      data: [
        { severity: 'high', status: 'open', count: 5 },
        { severity: 'high', status: 'in progress', count: 3 },
        { severity: 'medium', status: 'open', count: 8 },
        { severity: 'medium', status: 'resolved', count: 2 },
        { severity: 'low', status: 'closed', count: 10 },
      ],
      message: 'Success'
    };

    mockAxios.get.mockResolvedValue({ data: mockData });

    const result = await getDefectSeveritySummary(1);

    expect(mockAxios.get).toHaveBeenCalledWith('http://34.56.162.48:8087/api/v1/dashboard/defect_severity_summary/1');
    expect(result).toEqual(mockData.data);
    expect(console.log).toHaveBeenCalledWith('Full API response:', mockData);
    expect(console.log).toHaveBeenCalledWith('Defect severity summary integration success:', 'Success');
  });

  it('should handle API response without data array', async () => {
    const mockAxios = require('axios');
    const mockData = { message: 'No data available' };

    mockAxios.get.mockResolvedValue({ data: mockData });

    const result = await getDefectSeveritySummary(1);

    expect(result).toEqual([]);
    expect(console.warn).toHaveBeenCalledWith('API response does not contain a severity summary array:', mockData);
  });

  it('should handle API errors gracefully', async () => {
    const mockAxios = require('axios');
    const mockError = new Error('Network error');

    mockAxios.get.mockRejectedValue(mockError);

    const result = await getDefectSeveritySummary(1);

    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Defect severity summary integration error:', mockError);
  });

  it('should handle different project ID types', async () => {
    const mockAxios = require('axios');
    const mockData = { data: [], message: 'Success' };

    mockAxios.get.mockResolvedValue({ data: mockData });

    // Test with string ID
    await getDefectSeveritySummary('123');
    expect(mockAxios.get).toHaveBeenCalledWith('http://34.56.162.48:8087/api/v1/dashboard/defect_severity_summary/123');

    // Test with number ID
    await getDefectSeveritySummary(456);
    expect(mockAxios.get).toHaveBeenCalledWith('http://34.56.162.48:8087/api/v1/dashboard/defect_severity_summary/456');
  });

  it('should use base URL correctly', async () => {
    const mockAxios = require('axios');
    const mockData = { data: [], message: 'Success' };

    mockAxios.get.mockResolvedValue({ data: mockData });

    await getDefectSeveritySummary(1);

    // Should call with the correct endpoint path
    expect(mockAxios.get).toHaveBeenCalledWith('http://34.56.162.48:8087/api/v1/dashboard/defect_severity_summary/1');
  });
});
