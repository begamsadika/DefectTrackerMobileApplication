import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { getAllProjects } from '../api/projectget';
import { getDefectRemarkRatio } from '../api/defecttoratio';
import { getDefectDensity } from '../api/defectdensity';
import { getSeverityDSI } from '../api/sevirity';
import { getDefectSeveritySummary } from '../api/severitybreakdown';
import { getDefectType } from '../api/defecttype';
import { getDefectsByModule } from '../api/defectsbymodule';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import DefectPieChart from '../components/DefectPieCharts';
import DefectDensityMeter from '../components/DefectDensityMeter';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
// Backend response: { remarks, defects, ratio, category, color }
type DefectRemarkRatioData = {
  remarks: number;
  defects: number;
  ratio: string;
  category: string;
  color: string;
};




const initialBreakdown = {
  high: { total: 0, breakdown: [] as any[] },
  medium: { total: 0, breakdown: [] as any[] },
  low: { total: 0, breakdown: [] as any[] },
};

// Helper function to get color for defect status
const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'open':
    case 'new':
      return '#ef4444'; // Red
    case 'in progress':
    case 'assigned':
      return '#f59e0b'; // Orange
    case 'resolved':
    case 'fixed':
      return '#3b82f6'; // Blue
    case 'closed':
    case 'verified':
      return '#10b981'; // Green
    case 'reopened':
      return '#8b5cf6'; // Purple
    default:
      return '#6b7280'; // Gray
  }
};





// Use the same risk color mapping as Dashboard
const riskColors = {
  high: '#c90404',
  medium: '#d9c10d',
  low: '#0b9c40',
};




const ProjectDetails = () => {
  const [defectSeverityBreakdown, setDefectSeverityBreakdown] = useState(initialBreakdown);
  const [severityLoading, setSeverityLoading] = useState(false);
  const [showPieModal, setShowPieModal] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<'high' | 'medium' | 'low'>('high');
  const route = useRoute();
  const navigation = useNavigation<any>();

  // API-driven project list
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Store backend color and risk label for the selected project
  const [projectCardInfo, setProjectCardInfo] = useState<{ color: string; riskLabel: string }>({ color: '', riskLabel: '' });

  // Defect to remark ratio state
  const [defectRatio, setDefectRatio] = useState<DefectRemarkRatioData | null>(null);
  const [ratioLoading, setRatioLoading] = useState(false);

  // Defect Density state
  const [defectDensity, setDefectDensity] = useState<number | null>(null);
  const [defectDensityLoading, setDefectDensityLoading] = useState(false);
  // Fetch defect density when selected project changes
  useEffect(() => {
    if (selectedProject?.id) {
      setDefectDensityLoading(true);
      getDefectDensity(selectedProject.id)
        .then((data) => {
          // API returns { data: { defectDensity: number, ... }, ... }
          let densityValue = null;
          if (data && typeof data === 'object' && 'data' in data && typeof data.data === 'object' && 'defectDensity' in data.data) {
            densityValue = typeof data.data.defectDensity === 'number' ? data.data.defectDensity : Number(data.data.defectDensity);
          }
          setDefectDensity(typeof densityValue === 'number' && !isNaN(densityValue) ? densityValue : null);
        })
        .catch((error) => {
          console.error('Failed to fetch defect density:', error);
          setDefectDensity(null);
        })
        .finally(() => setDefectDensityLoading(false));
    }
  }, [selectedProject]);

  // Defect Severity Index state
  const [dsi, setDSI] = useState<number | null>(null);
  const [dsiLoading, setDSILoading] = useState(false);
  // Fetch DSI when selected project changes
  useEffect(() => {
    if (selectedProject?.id) {
      setDSILoading(true);
      getSeverityDSI(selectedProject.id)
        .then((data) => {
          // API returns { data: { dsiPercentage: number, ... }, ... }
          let dsiValue = null;
          if (data && typeof data === 'object' && 'data' in data && typeof data.data === 'object' && 'dsiPercentage' in data.data) {
            dsiValue = typeof data.data.dsiPercentage === 'number' ? data.data.dsiPercentage : Number(data.data.dsiPercentage);
          }
          setDSI(typeof dsiValue === 'number' && !isNaN(dsiValue) ? dsiValue : null);
        })
        .catch((error) => {
          console.error('Failed to fetch DSI:', error);
          setDSI(null);
        })
        .finally(() => setDSILoading(false));
    }
  }, [selectedProject]);

  // Fetch Defect Severity Breakdown when selected project changes
  useEffect(() => {
    if (selectedProject?.id) {
      setSeverityLoading(true);
      getDefectSeveritySummary(selectedProject.id)
        .then((data) => {
          console.log('Severity breakdown data received:', data);
          if (Array.isArray(data) && data.length > 0) {
            // Transform API data to match the expected structure (statuses is an object)
            const transformedData = {
              high: { total: 0, breakdown: [] as any[] },
              medium: { total: 0, breakdown: [] as any[] },
              low: { total: 0, breakdown: [] as any[] },
            };

            data.forEach((item: any) => {
              const severity = item.severity?.toLowerCase();
              if (severity && (severity === 'high' || severity === 'medium' || severity === 'low')) {
                transformedData[severity as keyof typeof transformedData].total = item.total || 0;
                // statuses is an object: { STATUS: { color, count }, ... }
                if (item.statuses && typeof item.statuses === 'object') {
                  transformedData[severity as keyof typeof transformedData].breakdown = Object.entries(item.statuses).map(([status, val]: [string, any]) => ({
                    label: status,
                    count: val.count || 0,
                    color: val.color || getStatusColor(status),
                  }));
                } else {
                  transformedData[severity as keyof typeof transformedData].breakdown = [];
                }
              }
            });

            setDefectSeverityBreakdown(transformedData);
          } else {
            console.warn('No severity breakdown data available');
            setDefectSeverityBreakdown(initialBreakdown);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch severity breakdown:', error);
          setDefectSeverityBreakdown(initialBreakdown);
        })
        .finally(() => setSeverityLoading(false));
    } else {
      setDefectSeverityBreakdown(initialBreakdown);
    }
  }, [selectedProject]);

  // @ts-ignore
  const { project: initialProject } = route.params || {};


  useEffect(() => {
    setLoading(true);
    getAllProjects()
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setProjects(arr);
        if (initialProject) {
          setSelectedProject(initialProject);
        } else if (arr.length > 0) {
          setSelectedProject(arr[0]);
        }
        setError(null);
      })
      .catch(() => {
        setError('Failed to load projects');
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, [initialProject]);

  // Fetch backend color and risk label for selected project (like Dashboard)
  useEffect(() => {
    async function fetchCardInfo() {
      if (selectedProject?.id) {
        try {
          const colorRes = await require('../api/colourcode').getProjectCardColor(selectedProject.id);
          if (colorRes && colorRes.data) {
            setProjectCardInfo({
              color: colorRes.data.projectCardColor || '',
              riskLabel: Array.isArray(colorRes.data.availableRiskLevels) && colorRes.data.availableRiskLevels.length > 0 ? colorRes.data.availableRiskLevels[0] : '',
            });
          } else {
            setProjectCardInfo({ color: '', riskLabel: '' });
          }
        } catch {
          setProjectCardInfo({ color: '', riskLabel: '' });
        }
      } else {
        setProjectCardInfo({ color: '', riskLabel: '' });
      }
    }
    fetchCardInfo();
  }, [selectedProject]);

  useEffect(() => {
    if (initialProject) {
      setSelectedProject(initialProject);
    }
  }, [initialProject]);

  // Fetch defect to remark ratio when selected project changes
  useEffect(() => {
    if (selectedProject?.id) {
      setRatioLoading(true);
      getDefectRemarkRatio(selectedProject.id)
        .then((response) => {
          console.log('Defect to Remark Ratio API response:', response);
          let ratioData: DefectRemarkRatioData | null = null;
          if (response && typeof response === 'object') {
            // Map backend fields to UI fields
            const level = (response as any).level;
            const colorMap: Record<string, string> = {
              Low: '#22c55e',
              Medium: '#facc15',
              High: '#ef4444',
            };
            let ratioValue = '0.00%';
            if (typeof (response as any).ratio === 'string') {
              ratioValue = (response as any).ratio;
            } else if (typeof (response as any).ratio === 'number') {
              // If backend gives a number like 98.01, treat as percent; if 0.9801, multiply by 100
              const num = (response as any).ratio;
              ratioValue = (num > 1 ? num : num * 100).toFixed(2) + '%';
            }
            ratioData = {
              remarks: typeof (response as any).remarkCount === 'number' ? (response as any).remarkCount : 0,
              defects: typeof (response as any).defectCount === 'number' ? (response as any).defectCount : 0,
              ratio: ratioValue,
              category: typeof level === 'string' ? level : 'Unknown',
              color: colorMap[level] || '#22c55e',
            };
          }
          setDefectRatio(ratioData);
        })
        .catch((error) => {
          console.error('Failed to fetch defect ratio:', error);
          setDefectRatio(null);
        })
        .finally(() => {
          setRatioLoading(false);
        });
    }
  }, [selectedProject]);


  // Compute risk and label using backend-driven logic (like Dashboard)
  let risk: 'high' | 'medium' | 'low' = 'low';
  let riskLabel = 'Low Risk';
  // Note: Project card styling can be enhanced with backend colors if needed
  if ((selectedProject?.risk === 'medium') || (projectCardInfo.riskLabel || '').toLowerCase().includes('medium')) {
    risk = 'medium';
    riskLabel = 'Medium Risk';
  } else if ((selectedProject?.risk === 'high') || (projectCardInfo.riskLabel || '').toLowerCase().includes('high')) {
    risk = 'high';
    riskLabel = 'High Risk';
  }

  // Pie chart data for "Defects Reopened Multiple Times"
  const reopenedDefectsData = [
    { label: '2 times', value: 183, color: '#3b82f6', percentage: 83.2 },
    { label: '4 times', value: 37, color: '#fbbf24', percentage: 16.8 },
  ];

  // Defect Distribution by Type (backend-driven, object response)
  const [defectTypeData, setDefectTypeData] = useState<any[]>([]);
  const [defectTypeLoading, setDefectTypeLoading] = useState(false);
  const [defectTypeTotal, setDefectTypeTotal] = useState(0);
  const [defectTypeMostCommon, setDefectTypeMostCommon] = useState('');
  const [defectTypeMostCommonValue, setDefectTypeMostCommonValue] = useState(0);

  useEffect(() => {
    if (selectedProject?.id) {
      setDefectTypeLoading(true);
      getDefectType(selectedProject.id)
        .then((data) => {
          // Expecting data: { defectTypes: [], totalDefectCount, mostCommonDefectType, mostCommonDefectCount }
          if (data && Array.isArray(data.defectTypes)) {
            const total = typeof data.totalDefectCount === 'number' ? data.totalDefectCount : 0;
            setDefectTypeTotal(total);
            setDefectTypeMostCommon(data.mostCommonDefectType || '');
            setDefectTypeMostCommonValue(data.mostCommonDefectCount || 0);
            // Map backend fields to chart fields: label, value, percentage, color
            const colorPalette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a78bfa', '#f97316', '#84cc16', '#f87171'];
            setDefectTypeData(
              data.defectTypes.map((item: any, idx: number) => ({
                label: item.defectType || item.label || item.type || 'Unknown',
                value: item.defectCount || item.count || item.value || 0,
                percentage: typeof item.percentage === 'number' ? item.percentage : (total > 0 ? ((item.defectCount || item.count || item.value || 0) / total) * 100 : 0),
                color: colorPalette[idx % colorPalette.length],
              }))
            );
          } else {
            setDefectTypeData([]);
            setDefectTypeTotal(0);
            setDefectTypeMostCommon('');
            setDefectTypeMostCommonValue(0);
          }
        })
        .catch(() => {
          setDefectTypeData([]);
          setDefectTypeTotal(0);
          setDefectTypeMostCommon('');
          setDefectTypeMostCommonValue(0);
        })
        .finally(() => setDefectTypeLoading(false));
    } else {
      setDefectTypeData([]);
      setDefectTypeTotal(0);
      setDefectTypeMostCommon('');
      setDefectTypeMostCommonValue(0);
    }
  }, [selectedProject]);

  // Defects by Module (backend-driven)
  const [defectsByModuleData, setDefectsByModuleData] = useState<any[]>([]);
  const [defectsByModuleLoading, setDefectsByModuleLoading] = useState(false);
  const [defectsByModuleTotal, setDefectsByModuleTotal] = useState(0);

  useEffect(() => {
    if (selectedProject?.id) {
      setDefectsByModuleLoading(true);
      getDefectsByModule(selectedProject.id)
        .then((data) => {
          // Backend returns array directly: [{ name, value, percentage }, ...]
          if (Array.isArray(data) && data.length > 0) {
            const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
            setDefectsByModuleTotal(total);
            const colorPalette = ['#3b82f6', '#22c55e', '#facc15', '#ef4444', '#a78bfa', '#06b6d4', '#f97316', '#f43f5e', '#84cc16', '#f87171'];
            setDefectsByModuleData(
              data.map((item: any, idx: number) => ({
                label: item.name || item.moduleName || item.label || 'Unknown',
                value: item.value || 0,
                percentage: typeof item.percentage === 'number' ? item.percentage : (total > 0 ? ((item.value || 0) / total) * 100 : 0),
                color: colorPalette[idx % colorPalette.length],
              }))
            );
          } else {
            setDefectsByModuleData([]);
            setDefectsByModuleTotal(0);
          }
        })
        .catch(() => {
          setDefectsByModuleData([]);
          setDefectsByModuleTotal(0);
        })
        .finally(() => setDefectsByModuleLoading(false));
    } else {
      setDefectsByModuleData([]);
      setDefectsByModuleTotal(0);
    }
  }, [selectedProject]);



  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });

    // Handle Android back button: go to Dashboard, not exit
    const onBackPress = () => {
      navigation.navigate('Dashboard');
      return true; // prevent default
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      backHandler.remove();
    };
  }, [navigation]);
  return (
    <View style={styles.container}>
      {/* Blue Section with Defect Tracker and Profile */}
      <View style={styles.blueHeaderSection}>
        <Text style={styles.bigDefectTracker}>Defect Tracker</Text>
        {/* Profile image overlapping bottom left of header */}
        <View style={styles.headerProfileOverlapWrap}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
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
        <Text style={styles.projectStatusCardName}>{selectedProject?.name || selectedProject?.projectName || ''}</Text>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: risk === 'high' ? '#fdecec' : risk === 'medium' ? '#fef9c3' : '#dcfce7', borderColor: risk === 'high' ? riskColors.high : risk === 'medium' ? riskColors.medium : riskColors.low, borderWidth: 2 },
          ]}
        >
          <Text
            style={[
              styles.statusPillText,
              { color: risk === 'high' ? riskColors.high : risk === 'medium' ? riskColors.medium : riskColors.low },
            ]}
          >
            {riskLabel}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>

      {/* Project Selection Horizontal Scroll */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>Project Selection</Text>
        {loading ? (
          <Text>Loading projects...</Text>
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : projects.length === 0 ? (
          <Text style={{ color: '#64748b', fontStyle: 'italic' }}>No projects available</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
            {projects.map((proj, idx) => (
              <TouchableOpacity
                key={proj.id ? proj.id.toString() : idx.toString()}
                style={[styles.chip, selectedProject?.id === proj.id ? styles.chipActive : null]}
                onPress={() => setSelectedProject(proj)}
              >
                <Text style={[styles.chipText, selectedProject?.id === proj.id ? styles.chipTextActive : null]}>{proj.name || proj.projectName || 'No Name'}</Text>
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
          {severityLoading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#64748b', fontStyle: 'italic' }}>Loading severity breakdown...</Text>
            </View>
          ) : (
          <View style={styles.breakdownCol}>
            {/* High */}
            <View style={[styles.breakdownCard, { borderColor: riskColors.high }]}>
              <View style={styles.breakdownCardHeader}>
                <Text style={[styles.breakdownCardTitle, { color: riskColors.high }]}>Defects on High</Text>
                <Text style={styles.breakdownTotal}>Total: {defectSeverityBreakdown.high.total}</Text>
              </View>
              <View style={styles.breakdownList}>
                {defectSeverityBreakdown.high.breakdown.length > 0 ? (
                  defectSeverityBreakdown.high.breakdown.map((item: any, i: number) => (
                    <Text key={item.label + i} style={{ color: item.color, fontWeight: 'bold', marginRight: 8 }}>{item.label} <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.count}</Text></Text>
                  ))
                ) : (
                  <Text style={{ color: '#64748b', fontStyle: 'italic' }}>No data available</Text>
                )}
              </View>
              <TouchableOpacity style={styles.viewChartButton} onPress={() => { setSelectedSeverity('high'); setShowPieModal(true); }}>
                <Text style={styles.viewChartButtonText}>View Chart</Text>
              </TouchableOpacity>
            </View>
            {/* Medium */}
            <View style={[styles.breakdownCard, { borderColor: riskColors.medium }]}> 
              <View style={styles.breakdownCardHeader}>
                <Text style={[styles.breakdownCardTitle, { color: riskColors.medium }]}>Defects on Medium</Text>
                <Text style={styles.breakdownTotal}>Total: {defectSeverityBreakdown.medium.total}</Text>
              </View>
              <View style={styles.breakdownList}>
                {defectSeverityBreakdown.medium.breakdown.length > 0 ? (
                  defectSeverityBreakdown.medium.breakdown.map((item: any, i: number) => (
                    <Text key={item.label + i} style={{ color: item.color, fontWeight: 'bold', marginRight: 8 }}>{item.label} <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.count}</Text></Text>
                  ))
                ) : (
                  <Text style={{ color: '#64748b', fontStyle: 'italic' }}>No data available</Text>
                )}
              </View>
              <TouchableOpacity style={styles.viewChartButton} onPress={() => { setSelectedSeverity('medium'); setShowPieModal(true); }}>
                <Text style={styles.viewChartButtonText}>View Chart</Text>
              </TouchableOpacity>
            </View>
            {/* Low */}
            <View style={[styles.breakdownCard, { borderColor: riskColors.low }]}> 
              <View style={styles.breakdownCardHeader}>
                <Text style={[styles.breakdownCardTitle, { color: riskColors.low }]}>Defects on Low</Text>
                <Text style={styles.breakdownTotal}>Total: {defectSeverityBreakdown.low.total}</Text>
              </View>
              <View style={styles.breakdownList}>
                {defectSeverityBreakdown.low.breakdown.length > 0 ? (
                  defectSeverityBreakdown.low.breakdown.map((item: any, i: number) => (
                    <Text key={item.label + i} style={{ color: item.color, fontWeight: 'bold', marginRight: 8 }}>{item.label} <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.count}</Text></Text>
                  ))
                ) : (
                  <Text style={{ color: '#64748b', fontStyle: 'italic' }}>No data available</Text>
                )}
              </View>
              <TouchableOpacity style={styles.viewChartButton} onPress={() => { setSelectedSeverity('low'); setShowPieModal(true); }}>
                <Text style={styles.viewChartButtonText}>View Chart</Text>
              </TouchableOpacity>
            </View>
          </View>
          )}

          {/* Modal for Pie Chart */}
          <Modal
            visible={showPieModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowPieModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Status Breakdown for {selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)}</Text>
                <DefectPieChart
                  title="Status Breakdown"
                  data={defectSeverityBreakdown[selectedSeverity].breakdown.map((item: any) => ({
                    label: item.label,
                    value: item.count,
                    color: item.color,
                    percentage: defectSeverityBreakdown[selectedSeverity].total > 0 ? (item.count / defectSeverityBreakdown[selectedSeverity].total) * 100 : 0
                  }))}
                  totalLabel="TOTAL DEFECTS"
                  totalValue={defectSeverityBreakdown[selectedSeverity].total}
                />
                <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowPieModal(false)}>
                  <Text style={styles.closeModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Summary Cards Row BELOW Defect Severity Breakdown */}
          <View style={styles.summaryCol}>
            {/* Defect Density Card - Increased Y Axis Size */}
            <View style={[styles.summaryCard, { paddingTop: 10, paddingBottom: 40, minHeight: 220 }]}> 
              <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, textAlign: 'center', color:'#14316e' }}>
                Defect Density: <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 24 }}>
                  {defectDensityLoading ? 'Loading...' : defectDensity !== null ? defectDensity : 'No Data'}
                </Text>
              </Text>
              {/* Gauge meter below (reuse DefectDensityMeter or custom meter) */}
              <DefectDensityMeter defectDensity={defectDensity !== null ? defectDensity : 0} />
            </View>
        {/* Defect Severity Index - Integrated with backend */}
        <View style={[styles.summaryCard, { minHeight: 180, alignItems: 'center', justifyContent: 'center', paddingTop: 18, paddingBottom: 32 }]}> 
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8, color: 'rgba(24,52,90,0.85)', textAlign: 'center' }}>
            Defect Severity Index
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
            <View style={{ alignItems: 'center', marginRight: 18 }}>
              <View style={{ width: 28, height: 100, backgroundColor: '#f1f5f9', borderRadius: 14, justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' }}>
                {/* Bar height proportional to DSI (max 100) */}
                <View style={{
                  width: 28,
                  height: dsi !== null && !dsiLoading ? Math.max(0, Math.min(100, dsi)) : 0,
                  backgroundColor: '#ef4444',
                  borderRadius: 14,
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                }} />
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
              {dsiLoading ? (
                <Text style={{ fontSize: 24, color: '#64748b', textAlign: 'center', marginBottom: 2 }}>Loading...</Text>
              ) : dsi !== null ? (
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#ef4444', textAlign: 'center', marginBottom: 2 }}>{dsi}</Text>
              ) : (
                <Text style={{ fontSize: 24, color: '#64748b', textAlign: 'center', marginBottom: 2 }}>No Data</Text>
              )}
              <Text style={{ fontSize: 15, color: '#64748b', textAlign: 'center', maxWidth: 180 }}>
                Weighted severity score (higher = more severe defects)
              </Text>
            </View>
          </View>
        </View>
            {/* Defect to Remark Ratio */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Defect to Remark Ratio</Text>
              <View
                style={[
                  styles.ratioBox,
                  defectRatio?.category === 'Low' && { backgroundColor: '#dcfce7' }, // green
                  defectRatio?.category === 'Medium' && { backgroundColor: '#fef9c3' }, // yellow
                  defectRatio?.category === 'High' && { backgroundColor: '#fdecec' }, // red
                ]}
              >
                {ratioLoading ? (
                  <Text style={[styles.ratioValue, { fontSize: 16 }]}>Loading...</Text>
                ) : defectRatio ? (
                  <>
                    <Text style={styles.ratioValue}>
                      {defectRatio.ratio || '0.00%'}
                    </Text>
                    <Text style={styles.ratioDesc}>Defect to Remark Ratio (%)</Text>
                    <View style={{
                      backgroundColor:
                        defectRatio.category === 'Low' ? '#22c55e' :
                        defectRatio.category === 'Medium' ? '#facc15' :
                        defectRatio.category === 'High' ? '#ef4444' : '#64748b',
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                      alignSelf: 'center',
                      marginTop: 4,
                    }}>
                      <Text style={styles.ratioBadgeText}>{defectRatio.category || 'Unknown'}</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={[styles.ratioValue, { fontSize: 16 }]}>No Data</Text>
                    <Text style={styles.ratioDesc}>Unable to load ratio data</Text>
                  </>
                )}
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
            <DefectPieChart
              title="Defect Distribution by Type"
              data={defectTypeData}
              totalLabel="TOTAL DEFECTS"
              totalValue={defectTypeTotal}
              mostCommonLabel={defectTypeMostCommon ? `Most Common ${defectTypeMostCommon}` : ''}
              mostCommonValue={defectTypeMostCommonValue}
            />
            <DefectPieChart
              title="Defects by Module"
              data={defectsByModuleData}
              totalLabel="TOTAL DEFECTS"
              totalValue={defectsByModuleTotal}
            />
          </View>

          {/* Time to Find/Fix Defects Charts */}
          {/* Time to Find Defects Line Chart (Single) */}
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 18, marginHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, marginTop:50}}>
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
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 18, marginHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
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
    backgroundColor: '#ef4444',
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
    backgroundColor: '#fecaca',
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
