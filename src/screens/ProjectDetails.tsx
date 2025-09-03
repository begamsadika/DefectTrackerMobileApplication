import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ImageBackground, Modal, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DefectPieChart from '../components/DefectPieCharts';
import DefectDensityMeter from '../components/DefectDensityMeter';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { getProjects } from '../api/projectget';
import { getDefectDensity } from '../api/defectdensity'; // Import getDefectDensity
import { getDefectRemarkRatio } from '../api/defectremarkratio'; // Import getDefectRemarkRatio
import { getDefectSeverityIndex } from '../api/severityindex'; // Import getDefectSeverityIndex
import { getDefectDistributionByType } from '../api/defectdistribution'; // Import getDefectDistributionByType
import { getDefectByModule } from '../api/defectbymodule'; // Import getDefectByModule
import { fetchSeveritySummary } from '../api/severitysummary'; // Import fetchSeveritySummary
import { RouteProp } from '@react-navigation/native';

// Remove static PROJECTS. We'll fetch from API.

interface SeverityBreakdownItem {
  label: string;
  count: number;
  color: string;
}

interface SelectedSeverityData {
  total: number;
  breakdown: SeverityBreakdownItem[];
}

interface Project { // Define Project interface to match what's passed from Dashboard
  id: number;
  project_name: string;
  project_status: string;
  risk: 'high' | 'medium' | 'low';
  cardColor?: string;
  colorCode?: string;
  backendStatus?: string;
}

type ProjectDetailsRouteParams = {
  project: Project;
};

const riskLabels = {
  high: 'High Risk',
  medium: 'Medium Risk',
  low: 'Low Risk',
};
const riskColors = {
  high: '#ef4444',
  medium: '#facc15',
  low: '#22c55e',
};

const getSeverityColor = (severityName: string) => {
  switch (severityName.toUpperCase()) {
    case 'CRITICAL': return '#ef4444'; // Red
    case 'HIGH': return '#f97316'; // Orange
    case 'MEDIUM': return '#eab308'; // Yellow
    case 'LOW': return '#22c55e'; // Green
    case 'COSMETIC': return '#3b82f6'; // Blue
    default: return '#64748b'; // Gray default
  }
};

const ProjectDetails = () => {
  const [showPieModal, setShowPieModal] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const route = useRoute<RouteProp<{
    ProjectDetails: ProjectDetailsRouteParams;
  }, 'ProjectDetails'>>();
  const navigation = useNavigation();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defectDensity, setDefectDensity] = useState<number | null>(null);
  const [defectDensityLoading, setDefectDensityLoading] = useState(false);
  const [defectDensityError, setDefectDensityError] = useState<string | null>(null);
  const [defectRemarkRatio, setDefectRemarkRatio] = useState<number | null>(null);
  const [ratioLabel, setRatioLabel] = useState<string | null>(null);
  const [defectRemarkRatioLoading, setDefectRemarkRatioLoading] = useState(false);
  const [defectRemarkRatioError, setDefectRemarkRatioError] = useState<string | null>(null);
  const [defectSeverityIndex, setDefectSeverityIndex] = useState<number | null>(null); // State for defect severity index
  const [defectSeverityIndexLoading, setDefectSeverityIndexLoading] = useState(false); // Loading state for severity index
  const [defectSeverityIndexError, setDefectSeverityIndexError] = useState<string | null>(null); // Error state for severity index
  const [defectSeverityInterpretation, setDefectSeverityInterpretation] = useState<string | null>(null); // State for severity interpretation
  const [defectDistributionData, setDefectDistributionData] = useState<any[]>([]);
  const [defectDistributionLoading, setDefectDistributionLoading] = useState(false);
  const [defectDistributionError, setDefectDistributionError] = useState<string | null>(null);
  const [defectByModuleData, setDefectByModuleData] = useState<any[]>([]); // State for defect by module data
  const [defectByModuleLoading, setDefectByModuleLoading] = useState(false); // Loading state for defect by module
  const [defectByModuleError, setDefectByModuleError] = useState<string | null>(null); // Error state for defect by module
  const [severitySummaryData, setSeveritySummaryData] = useState<any[]>([]); // State for defect severity summary
  const [severitySummaryLoading, setSeveritySummaryLoading] = useState(false); // Loading state for severity summary
  const [severitySummaryError, setSeveritySummaryError] = useState<string | null>(null); // Error state for severity summary
  const [selectedSeverityData, setSelectedSeverityData] = useState<SelectedSeverityData>({ total: 0, breakdown: [] }); // State to hold selected severity breakdown for modal

  // Function to map project_status to risk
  const getRiskFromStatus = (status: string): 'high' | 'medium' | 'low' => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'high'; // Or 'medium' depending on your logic
      case 'PLANNED':
        return 'medium'; // Or 'low'
      case 'COMPLETED':
        return 'low';
      default:
        return 'low'; // Default to low risk
    }
  };

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);

        // Set selectedProject based on route params or first fetched project
        const projectFromParams = route.params?.project;
        if (projectFromParams) {
          setSelectedProject(projectFromParams);
        } else if (fetchedProjects.length > 0) {
          setSelectedProject({ ...fetchedProjects[0], risk: getRiskFromStatus(fetchedProjects[0].project_status) });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, [route.params?.project]); // Re-run when project param changes

  useEffect(() => {
    if (selectedProject?.id) {
      const fetchDefectDensity = async () => {
        setDefectDensityLoading(true);
        try {
          const data = await getDefectDensity(selectedProject.id);
          setDefectDensity(data.data.defectDensity);
        } catch (err: any) {
          setDefectDensityError(err.message || 'Failed to fetch defect density');
        } finally {
          setDefectDensityLoading(false);
        }
      };
      fetchDefectDensity();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject?.id) {
      const fetchDefectRemarkRatio = async () => {
        setDefectRemarkRatioLoading(true);
        try {
          const data = await getDefectRemarkRatio(selectedProject.id);
          setDefectRemarkRatio(parseFloat(data.data.ratio));
          setRatioLabel(data.data.category);
        } catch (err: any) {
          setDefectRemarkRatioError(err.message || 'Failed to fetch defect to remark ratio');
        } finally {
          setDefectRemarkRatioLoading(false);
        }
      };
      fetchDefectRemarkRatio();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject?.id) {
      const fetchDefectSeverityIndex = async () => {
        setDefectSeverityIndexLoading(true);
        try {
          const data = await getDefectSeverityIndex(selectedProject.id);
          const dsiValue = parseFloat(data.data.data.dsiPercentage);
          setDefectSeverityIndex(isNaN(dsiValue) ? null : dsiValue);
          setDefectSeverityInterpretation(data.data.data.interpretation);
        } catch (err: any) {
          setDefectSeverityIndexError(err.message || 'Failed to fetch defect severity index');
        } finally {
          setDefectSeverityIndexLoading(false);
        }
      };
      fetchDefectSeverityIndex();
    }
  }, [selectedProject]);

  useEffect(() => {
    console.log('Selected project:', selectedProject);
    if (selectedProject?.id) {
      const fetchDefectDistribution = async () => {
        setDefectDistributionLoading(true);
        try {
          const data = await getDefectDistributionByType(selectedProject.id);
          console.log('Defect distribution API response:', data);
          setDefectDistributionData(data.data.distribution || []);
        } catch (err: any) {
          setDefectDistributionError(err.message || 'Failed to fetch defect distribution by type');
        } finally {
          setDefectDistributionLoading(false);
        }
      };
      fetchDefectDistribution();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject?.id) {
      const fetchDefectByModuleData = async () => {
        setDefectByModuleLoading(true);
        try {
          const data = await getDefectByModule(selectedProject.id);
          console.log('Defect by module API response:', data);
          setDefectByModuleData(data.data.distribution || []);
        } catch (err: any) {
          setDefectByModuleError(err.message || 'Failed to fetch defect by module data');
        } finally {
          setDefectByModuleLoading(false);
        }
      };
      fetchDefectByModuleData();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject?.id) {
      const fetchSeveritySummaryData = async () => {
        setSeveritySummaryLoading(true);
        try {
          const data = await fetchSeveritySummary(selectedProject.id);
          const defectSummary = data?.defectSummary || [];
          setSeveritySummaryData(defectSummary);
          // Set initial selected severity for the modal based on the first item or a default
          if (defectSummary.length > 0) {
            setSelectedSeverity(defectSummary[0].severity);
            setSelectedSeverityData({
              total: defectSummary[0].total,
              // The backend response has 'statuses' which needs to be transformed to 'breakdown'
              breakdown: Object.entries(defectSummary[0].statuses).map(([statusName, statusData]: [string, any]) => ({
                label: statusName,
                count: statusData.count,
                color: statusData.color || '#64748b', // Use the color directly from the backend, with a gray fallback
              })),
            });
          } else {
            setSelectedSeverity(null);
            setSelectedSeverityData({ total: 0, breakdown: [] });
          }
        } catch (err: any) {
          console.error("Error fetching defect severity summary:", err);
          setSeveritySummaryError(err.message || 'Failed to fetch severity summary');
          setSelectedSeverityData({ total: 0, breakdown: [] }); // Also set default on error
        } finally {
          setSeveritySummaryLoading(false);
        }
      };
      fetchSeveritySummaryData();
    } else {
      // If no selected project, reset severity data
      setSelectedSeverity(null);
      setSeveritySummaryData([]); // Also reset severitySummaryData
      setSelectedSeverityData({ total: 0, breakdown: [] });
    }
  }, [selectedProject]);

  // Helper to get total defects for a given severity
  const getTotalDefectsForSeverity = (severityName: string) => {
    const severity = severitySummaryData.find((item: any) => item.severity.toLowerCase() === severityName.toLowerCase());
    return severity ? severity.total : 0;
  };

  // Helper to get defect breakdown for a given severity
  const getBreakdownForSeverity = (severityName: string): SeverityBreakdownItem[] => {
    const severityItem = severitySummaryData.find((item: any) => item.severity.toLowerCase() === severityName.toLowerCase());
    if (!severityItem || !severityItem.statuses) return [];

    return Object.entries(severityItem.statuses).map(([statusName, statusData]: [string, any]) => ({
      label: statusName,
      count: statusData.count,
      color: statusData.color || '#64748b', // Use the color directly from the backend, with a gray fallback
    }));
  };

  const risk: 'high' | 'medium' | 'low' = selectedProject?.risk || 'low';

  // Map fetched severity data to a structure usable by the breakdown cards and modal
  const severityBreakdownData = Array.isArray(severitySummaryData) ? severitySummaryData.reduce((acc: any, item: any) => {
    const severityKey = item.severity.toLowerCase(); // e.g., 'critical', 'high', 'medium', 'low', 'cosmetic'
    acc[severityKey] = {
      total: item.total,
      breakdown: getBreakdownForSeverity(item.severity),
    };
    return acc;
  }, {}) : {};

  // Define a mapping from severity name to a generic risk category for color/labeling
  const mapSeverityToRiskCategory = (severityName: string): 'high' | 'medium' | 'low' => {
    switch (severityName.toLowerCase()) {
      case 'critical': return 'high';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      case 'cosmetic': return 'low';
      default: return 'low';
    }
  };

  // Function to assign consistent colors to defect types
  const getDefectTypeColor = (defectType: string) => {
    switch (defectType) {
      case 'UI/UX': return '#3b82f6'; // Blue
      case 'Backend Logic': return '#ef4444'; // Red
      case 'Functionality': return '#10b981'; // Green
      case 'Usability': return '#f59e0b'; // Orange
      case 'Validation': return '#7e22ce'; // Purple
      default: return '#64748b'; // Gray default
    }
  };

  // Function to assign consistent colors to module types
  const getModuleColor = (moduleName: string | undefined | null) => {
    if (!moduleName) {
      return '#64748b'; // Default color for undefined/null moduleName
    }
    const colors = ['#3b82f6', '#22c55e', '#facc15', '#ef4444', '#a78bfa', '#06b6d4', '#f97316', '#f43f5e', '#84cc16', '#f87171'];
    let hash = 0;
    for (let i = 0; i < moduleName.length; i++) {
      hash = moduleName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  // Pie chart data for "Defects Reopened Multiple Times"
  const reopenedDefectsData = [
    { label: '2 times', value: 183, color: '#3b82f6', percentage: 83.2 },
    { label: '4 times', value: 37, color: '#fbbf24', percentage: 16.8 },
  ];

  // Pie chart data for "Defect Distribution by Type"
  const defectTypeData = [
    { label: 'Functionality', value: 245, color: '#3b82f6', percentage: 53.4 },
    { label: 'UI-UX', value: 31, color: '#10b981', percentage: 7.0 },
    { label: 'Usability', value: 80, color: '#f59e0b', percentage: 17.6 },
    { label: 'Validation', value: 103, color: '#ef4444', percentage: 22.4 },
  ];

  // Pie chart data for "Defects by Module"
  const defectsByModuleData = [
    { label: 'Configurations', value: 77, color: '#3b82f6', percentage: 16.78 },
    { label: 'Project Management', value: 53, color: '#22c55e', percentage: 11.55 },
    { label: 'Bench', value: 58, color: '#facc15', percentage: 12.64 },
    { label: 'Defects', value: 67, color: '#ef4444', percentage: 14.60 },
    { label: 'Test Cases', value: 58, color: '#a78bfa', percentage: 12.64 },
    { label: 'Employee', value: 67, color: '#06b6d4', percentage: 14.60 },
    { label: 'Releases', value: 34, color: '#f97316', percentage: 7.41 },
    { label: 'Project', value: 22, color: '#f43f5e', percentage: 4.79 },
    { label: 'Main Template', value: 4, color: '#84cc16', percentage: 0.87 },
    { label: 'Dashboard', value: 19, color: '#f87171', percentage: 4.14 },
  ];

  const ModalPieChartContent = ({ selectedSeverity, selectedSeverityData }: { selectedSeverity: string | null; selectedSeverityData: SelectedSeverityData }) => {
    if (!selectedSeverityData || !selectedSeverity) {
      return <Text>No data available for this severity.</Text>;
    }
    return (
      <>
        <Text style={styles.modalTitle}>Status Breakdown for {selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)}</Text>
        <DefectPieChart
          title="Status Breakdown"
          data={selectedSeverityData.breakdown.map((item: SeverityBreakdownItem) => ({
            label: item.label,
            value: item.count,
            color: item.color,
            percentage: selectedSeverityData.total > 0 ? (item.count / selectedSeverityData.total) * 100 : 0
          }))}
          totalLabel="TOTAL DEFECTS"
          totalValue={selectedSeverityData.total}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* Custom blue header section */}
      <View style={styles.blueHeaderSection}>
        <Text style={styles.bigDefectTracker}>Defect Tracker</Text>
        <View style={styles.headerProfileOverlapWrap}>
          <TouchableOpacity onPress={() => (navigation as any).navigate('Settings')}>
            <View style={styles.headerProfileCircle}>
              <Image
                source={require('../assets/prfile.jpg')}
                style={styles.headerProfileImg}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Project name and status card/button below header */}
      <View style={styles.projectStatusCardButton}>
        <Text style={styles.projectStatusCardName} numberOfLines={2} ellipsizeMode='tail'>{selectedProject?.project_name}</Text>
        <TouchableOpacity
          style={[
            styles.statusPill,
            risk === 'high' && { backgroundColor: '#fdecec', borderColor: '#ef4444', borderWidth: 2 },
            risk === 'medium' && { backgroundColor: '#fef9c3', borderColor: '#facc15', borderWidth: 2 },
            risk === 'low' && { backgroundColor: '#dcfce7', borderColor: '#22c55e', borderWidth: 2 },
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.statusPillText,
              risk === 'high' && { color: '#ef4444' },
              risk === 'medium' && { color: '#facc15' },
              risk === 'low' && { color: '#22c55e' },
            ]}
          >
            {riskLabels[risk]}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>

      {/* Project Selection Horizontal Scroll */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>Project Selection</Text>
        {loading ? (
          <Text>Loading projects...</Text>
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
            {projects.map((proj: any, idx: number) => (
              <TouchableOpacity
                key={proj.id || idx} // Use proj.id if available, otherwise fallback to idx
                style={[styles.chip, selectedProject?.id === proj.id ? styles.chipActive : null]}
                onPress={() => setSelectedProject({ ...proj, risk: getRiskFromStatus(proj.project_status) })}
              >
                <Text style={[styles.chipText, selectedProject?.id === proj.id ? styles.chipTextActive : null]}>{proj.project_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

          

          {/* Defect Severity Breakdown */}
          <Text style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#14316e',
            marginTop: 12,
            marginLeft: 8,
            marginBottom: 18,
            textAlign: 'left',
          }}>Defect Severity Breakdown</Text>
          <View style={styles.breakdownCol}>
            {severitySummaryLoading ? (
              <Text>Loading severity summary...</Text>
            ) : severitySummaryError ? (
              <Text style={{ color: 'red' }}>{severitySummaryError}</Text>
            ) : (severitySummaryData && severitySummaryData.length > 0 ? (
              severitySummaryData.map((severityItem: any) => {
                const mappedRiskCategory = mapSeverityToRiskCategory(severityItem.severity);
                return (
                  <View key={severityItem.severity} style={[styles.breakdownCard, { borderColor: riskColors[mappedRiskCategory] }]}>
                    <View style={styles.breakdownCardHeader}>
                      <Text style={[styles.breakdownCardTitle, { color: getSeverityColor(severityItem.severity) }]}>Defects on {severityItem.severity}</Text>
                      <Text style={styles.breakdownTotal}>Total: {severityItem.total}</Text>
                    </View>
                    <View style={styles.breakdownList}>
                      {getBreakdownForSeverity(severityItem.severity).map((item, i) => (
                        <Text key={item.label + i} style={{ color: item.color, fontWeight: 'bold', marginRight: 8 }}>{item.label} <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.count}</Text></Text>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={styles.viewChartButton}
                      onPress={() => {
                        setSelectedSeverity(severityItem.severity);
                        setSelectedSeverityData({
                          total: severityItem.total,
                          breakdown: getBreakdownForSeverity(severityItem.severity),
                        });
                        setShowPieModal(true);
                      }}
                    >
                      <Text style={styles.viewChartButtonText}>View Chart</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <Text>No severity summary data available.</Text>
            ))}
          </View>

          {/* Modal for Pie Chart */}
          <Modal
            visible={showPieModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowPieModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ModalPieChartContent selectedSeverity={selectedSeverity} selectedSeverityData={selectedSeverityData} />
                <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowPieModal(false)}>
                  <Text style={styles.closeModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Summary Cards Row BELOW Defect Severity Breakdown */}
          <View style={styles.summaryCol}>
            {/* Defect Density Card - Increased Y Axis Size */}
            <View style={[styles.summaryCard, { paddingTop: 40, paddingBottom: 40, minHeight: 220 }]}> 
              <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, textAlign: 'center', color:'#14316e' }}>
                Defect Density: <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 24 }}>{defectDensityLoading ? 'Loading...' : defectDensityError ? 'Error' : (defectDensity !== null && typeof defectDensity === 'number') ? defectDensity.toFixed(2) : 'N/A'}</Text>
              </Text>
              {/* Gauge meter below (reuse DefectDensityMeter or custom meter) */}
              {defectDensityLoading ? (
                <Text>Loading defect density meter...</Text>
              ) : defectDensityError ? (
                <Text style={{ color: 'red' }}>{defectDensityError}</Text>
              ) : defectDensity !== null ? (
                <DefectDensityMeter defectDensity={defectDensity} />
              ) : (
                <Text>No defect density data available.</Text>
              )}
            </View>
        {/* Defect Severity Index - Updated to match screenshot */}
        <View style={[styles.summaryCard, { minHeight: 180, alignItems: 'center', justifyContent: 'center', paddingTop: 32, paddingBottom: 32 }]}> 
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8, color: 'rgba(24,52,90,0.85)', textAlign: 'center' }}>
            Defect Severity Index
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
            <View style={{ alignItems: 'center', marginRight: 18 }}>
              <View style={{ width: 28, height: 100, backgroundColor: '#f1f5f9', borderRadius: 14, justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' }}>
                <View style={{ width: 28, height: ((defectSeverityIndex || 0) / 100) * 100, backgroundColor: '#ef4444', borderRadius: 14 }} />
              </View>
              {/* Y axis labels */}
              <View style={{ position: 'absolute', left: -32, top: 0, height: 100, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'right' }}>100</Text>
                <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'right' }}>75</Text>
                <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'right' }}>50</Text>
                <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'right' }}>25</Text>
                <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'right' }}>0</Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#ef4444', textAlign: 'center', marginBottom: 2 }}>
                {defectSeverityIndexLoading ? 'Loading...' : defectSeverityIndexError ? 'Error' : (defectSeverityIndex !== null && typeof defectSeverityIndex === 'number') ? defectSeverityIndex.toFixed(1) : 'N/A'}
              </Text>
              <Text style={{ fontSize: 15, color: '#64748b', textAlign: 'center', maxWidth: 180 }}>
                {defectSeverityIndexLoading ? 'Loading...' : defectSeverityIndexError ? 'Error' : defectSeverityInterpretation || 'N/A'}
              </Text>
            </View>
          </View>
        </View>
            {/* Defect to Remark Ratio */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Defect to Remark Ratio</Text>
              <View style={[styles.ratioBox, ratioLabel === 'High' ? { backgroundColor: '#fdecec' } : ratioLabel === 'Medium' ? { backgroundColor: '#fef9c3' } : { backgroundColor: '#dcfce7' }]}>
                <Text style={styles.ratioValue}>{defectRemarkRatioLoading ? 'Loading...' : defectRemarkRatioError ? 'Error' : (defectRemarkRatio !== null && typeof defectRemarkRatio === 'number') ? `${defectRemarkRatio.toFixed(2)}%` : 'N/A'}</Text>
                <Text style={styles.ratioDesc}>Defect to Remark Ratio (%)</Text>
                <View style={[styles.ratioBadge, ratioLabel === 'High' ? {backgroundColor: '#ef4444'} : ratioLabel === 'Medium' ? {backgroundColor: '#facc15'} : {backgroundColor: '#22c55e'}]}><Text style={styles.ratioBadgeText}>{ratioLabel || 'N/A'}</Text></View>
              </View>
            </View>
          </View>

          {/* Defect Analysis Charts */}
          <Text style={styles.breakdownTitle}>Defect Analysis</Text>
          <View style={{gap: 20, paddingHorizontal: 16, paddingVertical: 8}}>
            <DefectPieChart
              title="Defects Reopened Multiple Times"
              data={reopenedDefectsData}
              totalLabel="TOTAL DEFECTS"
              totalValue={220}
            />
            {defectDistributionLoading ? (
              <Text>Loading defect distribution...</Text>
            ) : defectDistributionError ? (
              <Text style={{ color: 'red' }}>{defectDistributionError}</Text>
            ) : (
              (() => {
                const chartData = defectDistributionData.map((item: any) => ({
                  label: item.defectType,
                  value: item.count,
                  color: getDefectTypeColor(item.defectType),
                  percentage: item.percentage,
                }));
                console.log('DefectPieChart data:', chartData);
                return (
                  <DefectPieChart
                    title="Defect Distribution by Type"
                    data={chartData}
                    totalLabel="TOTAL DEFECTS"
                    totalValue={defectDistributionData.reduce((sum: number, item: any) => sum + item.count, 0)}
                    mostCommonLabel={defectDistributionData.length > 0 ? `Most Common ${defectDistributionData.reduce((prev: any, current: any) => (prev.count > current.count) ? prev : current).defectType}` : "Most Common"}
                    mostCommonValue={defectDistributionData.length > 0 ? Math.max(...defectDistributionData.map((item: any) => item.count)) : 0}
                  />
                );
              })()
            )}
            {defectByModuleLoading ? (
              <Text>Loading defects by module...</Text>
            ) : defectByModuleError ? (
              <Text style={{ color: 'red' }}>{defectByModuleError}</Text>
            ) : (
              <DefectPieChart
                title="Defects by Module"
                data={defectByModuleData.map((item: any, idx: number) => ({
                  label: item.module && item.module.trim() !== '' ? item.module : `Unknown ${idx + 1}`,
                  value: item.count,
                  color: getModuleColor(item.module),
                  percentage: item.percentage,
                  key: `${item.module || 'unknown'}-${idx}`
                }))}
                totalLabel="TOTAL DEFECTS"
                totalValue={defectByModuleData.reduce((sum: number, item: any) => sum + item.count, 0)}
              />
            )}
          </View>

          {/* Time to Find/Fix Defects Charts */}
          {/* Time to Find Defects Line Chart (Single) */}
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#14316e', marginBottom: 12 }}>Time to Find Defects</Text>
            <View style={{ alignItems: 'center' }}>
              <Svg width={320} height={213}>
                {/* Axes */}
                <Path d="M40,180 L300,180" stroke="#222" strokeWidth={2} />
                <Path d="M40,180 L40,30" stroke="#222" strokeWidth={2} />
                {/* Grid lines */}
                {[1,2,3,4].map(i => (
                  <Path key={i} d={`M40,${180-i*30} L300,${180-i*30}`} stroke="#e5e7eb" strokeWidth={1} />
                ))}
                {/* Dummy data points */}
                {(() => {
                  const data = [2,3,1,4,2,3,2,1,2,1];
                  const points = data.map((v,i) => {
                    const x = 40 + (260/9)*i;
                    const y = 180 - (v-1)*37.5;
                    return { x, y };
                  });
                  // Line path
                  const linePath = points.map((p,i) => i===0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`).join(' ');
                  return (
                    <>
                      <Path d={linePath} stroke="#2563eb" strokeWidth={3} fill="none" />
                      {points.map((p,i) => (
                        <Circle key={i} cx={p.x} cy={p.y} r={6} fill="#2563eb" stroke="#fff" strokeWidth={2} />
                      ))}
                    </>
                  );
                })()}
                {/* Y axis labels */}
                {[1,2,3,4,5].map(i => (
                  <SvgText key={i} x={10} y={180-(i-1)*30+6} fontSize={15} fill="#64748b">{i}</SvgText>
                ))}
                {/* X axis labels */}
                {Array.from({length:10}).map((_,i) => (
                  <SvgText key={i} x={40+(260/9)*i-12} y={195} fontSize={9} fill="#64748b">Day {i+1}</SvgText>
                ))}
                {/* Axis titles */}
                <SvgText x={-25} y={9} fontSize={10} fill="#64748b" rotation={-90} textAnchor="middle">Def Count</SvgText>
                <SvgText x={152} y={210} fontSize={11} fill="#64748b" textAnchor="middle">Time (Day)</SvgText>
              </Svg>
            </View>
          </View>
          {/* Time to Fix Defects Line Chart (Single) */}
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#14316e', marginBottom: 12 }}>Time to Fix Defects</Text>
            <View style={{ alignItems: 'center' }}>
              <Svg width={320} height={215}>
                {/* Axes */}
                <Path d="M40,180 L300,180" stroke="#222" strokeWidth={2} />
                <Path d="M40,180 L40,30" stroke="#222" strokeWidth={2} />
                {/* Grid lines */}
                {[1,2,3,4].map(i => (
                  <Path key={i} d={`M40,${180-i*30} L300,${180-i*30}`} stroke="#e5e7eb" strokeWidth={1} />
                ))}
                {/* Dummy data points */}
                {(() => {
                  const data = [3,2,4,3,2,3,2,2,1,2];
                  const points = data.map((v,i) => {
                    const x = 40 + (260/9)*i;
                    const y = 180 - (v-1)*37.5;
                    return { x, y };
                  });
                  // Line path
                  const linePath = points.map((p,i) => i===0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`).join(' ');
                  return (
                    <>
                      <Path d={linePath} stroke="#22c55e" strokeWidth={3} fill="none" />
                      {points.map((p,i) => (
                        <Circle key={i} cx={p.x} cy={p.y} r={6} fill="#22c55e" stroke="#fff" strokeWidth={2} />
                      ))}
                    </>
                  );
                })()}
                {/* Y axis labels */}
                {[1,2,3,4,5].map(i => (
                  <SvgText key={i} x={10} y={180-(i-1)*30+6} fontSize={15} fill="#64748b">{i}</SvgText>
                ))}
                {/* X axis labels */}
                {Array.from({length:10}).map((_,i) => (
                  <SvgText key={i} x={40+(260/9)*i-12} y={195} fontSize={9} fill="#64748b">Day {i+1}</SvgText>
                ))}
                {/* Axis titles */}
                <SvgText x={-45} y={9} fontSize={10} fill="#64748b" rotation={-90}>Def Count</SvgText>
                <SvgText x={122} y={210} fontSize={11} fill="#64748b">Time (Day)</SvgText>
              </Svg>
            </View>
          </View>
        </ScrollView>
        </View>
  );
};

const styles = StyleSheet.create({
  statusPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fdecec',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  statusPillText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    textAlign: 'center',
  },
  viewChartButton: {
    backgroundColor: '#14316e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 2,
    elevation: 2,
  },
  viewChartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  headerProfileOverlapWrap: {
    position: 'absolute',
    left: 18,
    bottom: -28,
    zIndex: 2,
  },
  // ...existing code...
  projectStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 18,
  },
  projectStatusName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14316e',
    marginLeft: 82,
    marginBottom: 2,
  },
  projectStatusLabel: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'right',
  },
  projectStatusValue: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40, // add vertical padding to reduce modal height
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    minWidth: 100,
    alignItems: 'center',
    elevation: 8,
    maxHeight: 640,
    // paddingVertical: ,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 2,
  },
  // ...existing code...
  ratioDesc: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratioBadge: {
    // backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignSelf: 'center',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  summaryCol: {
    flexDirection: 'column',
    gap: 16,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 12,
    gap: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    flex: 1,
    minWidth: 220,
    elevation: 2,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#14316e',
    marginBottom: 4,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  severityBarWrap: {
    width: 18,
    height: 70,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  severityBar: {
    width: 18,
    height: 60,
    backgroundColor: '#ef4444',
    borderRadius: 10,
  },
  severityValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
  },
  severityDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
  },
  ratioBox: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  ratioValue: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: '#14316e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 18,
    elevation: 2,
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 2,
    textAlign: 'center',
  },
  ratioBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  projectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  projectCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    alignSelf: 'center',
    elevation: 2,
  },
  riskHigh: {
    backgroundColor: '#ef4444',
  },
  riskMedium: {
    backgroundColor: '#facc15',
  },
  riskLow: {
    backgroundColor: '#22c55e',
  },
  projectIconWrap: {
    marginBottom: 8,
  },
  projectIcon: {
    fontSize: 38,
    color: '#fff',
  },
  projectName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  riskLabelWrap: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  riskLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  breakdownCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  selectorContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 14,
    padding: 16,
    elevation: 2,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#14316e',
  },
  selectorScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginHorizontal: 4,
    elevation: 1,
  },
  chipActive: {
    backgroundColor: 'rgba(24,52,90,0.85)',
    elevation: 3,
  },
  chipText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chipTextActive: {
    color: '#fff',
  },
  customHeader: {
    backgroundColor: '#061d5bff',
    height: 120,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  // Removed duplicate headerProfileCircle/headerProfileImg styles
  headerProfileWrap: {
    position: 'absolute',
    left: 18,
    bottom: -20,
    zIndex: 10,
  },
  // ...existing code...
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop:16,
    marginLeft: 18,
    marginBottom: 12,
  },
  breakdownCol: {
    flexDirection: 'column',
    marginHorizontal: 8,
    marginBottom: 24,
    gap: 16,
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 3,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  breakdownCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  breakdownTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  breakdownList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 16,
  },
  chartsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 8,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(24,52,90,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backIcon: {
    fontSize: 26,
    color: '#19407a',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'left',
  },
  blueHeaderSection: {
    backgroundColor: '#061d5bff',
    height: 120,
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  bigDefectTracker: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  projectInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    marginTop: 0,
  },
  projectNameStatusCol: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  selectedProjectName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statusBadge: {
    backgroundColor: '#19407a',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 0,
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  headerProfileCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
  },
  headerProfileImg: {
    width: 50,
    height: 50,
    borderRadius: 23,
    resizeMode: 'cover',
  },
  projectStatusCardButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginTop: 44,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 6,
    borderColor: '#061d5bff',
  },
  projectStatusCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14316e',
    flexShrink: 1,
  },
  projectStatusCardLabel: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'right',
  },
  projectStatusCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 2,
  },
});

export default ProjectDetails;
