export interface Project {
  id: number;
  name: string;
  description?: string;
  // Add other fields as needed
}

export interface DefectRemarkRatio {
  ratio: number;
  percentage: number;
  level: 'High' | 'Medium' | 'Low' | 'Unknown';
  defectCount?: number;
  remarkCount?: number;
}
