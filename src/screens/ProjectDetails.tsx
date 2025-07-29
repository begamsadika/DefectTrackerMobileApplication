import React, { useState, useEffect } from 'react';
import { getAllProjects } from '../api/projectget';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ImageBackground, Modal, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import DefectPieChart from '../components/DefectPieCharts';
import DefectDensityMeter from '../components/DefectDensityMeter';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';


// Remove static PROJECTS. We'll fetch from API.

const DEFECTS = {
  high: {
    total: 112,
    breakdown: [
      { label: 'REOPEN', color: '#ef4444', count: 3 },
      { label: 'NEW', color: '#3b82f6', count: 50 },
      { label: 'OPEN', color: '#22c55e', count: 5 },
      { label: 'FIXED', color: '#a3e635', count: 14 },
      { label: 'CLOSED', color: '#15803d', count: 37 },
      { label: 'REJECTED', color: '#7e22ce', count: 0 },
      { label: 'DUPLICATE', color: '#f59e42', count: 3 },
    ],
  },
  medium: {
    total: 236,
    breakdown: [
      { label: 'REOPEN', color: '#ef4444', count: 5 },
      { label: 'NEW', color: '#3b82f6', count: 125 },
      { label: 'OPEN', color: '#22c55e', count: 10 },
      { label: 'FIXED', color: '#a3e635', count: 33 },
      { label: 'CLOSED', color: '#15803d', count: 60 },
      { label: 'REJECTED', color: '#7e22ce', count: 2 },
      { label: 'DUPLICATE', color: '#f59e42', count: 1 },
    ],
  },
  low: {
    total: 97,
    breakdown: [
      { label: 'REOPEN', color: '#ef4444', count: 1 },
      { label: 'NEW', color: '#3b82f6', count: 58 },
      { label: 'OPEN', color: '#22c55e', count: 0 },
      { label: 'FIXED', color: '#a3e635', count: 10 },
      { label: 'CLOSED', color: '#15803d', count: 24 },
      { label: 'REJECTED', color: '#7e22ce', count: 1 },
      { label: 'DUPLICATE', color: '#f59e42', count: 3 },
    ],
  },
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


const ProjectDetails = () => {
  const [showPieModal, setShowPieModal] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<'high' | 'medium' | 'low'>('high');
  const route = useRoute();
  const navigation = useNavigation<any>();
  // API-driven project list
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  // @ts-ignore
  const { project: initialProject } = route.params || {};
  useEffect(() => {
    if (initialProject) {
      setSelectedProject(initialProject);
    }
  }, [initialProject]);

  // If project.risk is not present, default to 'low'
  const risk: 'high' | 'medium' | 'low' = selectedProject?.risk || 'low';
  const defects = DEFECTS[risk];

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



  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
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
        <Text style={styles.projectStatusCardName}>{selectedProject?.name}</Text>
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
          <View style={styles.breakdownCol}>
            {/* High */}
            <View style={[styles.breakdownCard, { borderColor: riskColors.high }]}> 
              <View style={styles.breakdownCardHeader}>
                <Text style={[styles.breakdownCardTitle, { color: riskColors.high }]}>Defects on High</Text>
                <Text style={styles.breakdownTotal}>Total: {DEFECTS.high.total}</Text>
              </View>
              <View style={styles.breakdownList}>
                {DEFECTS.high.breakdown.map((item, i) => (
                  <Text key={item.label + i} style={{ color: item.color, fontWeight: 'bold', marginRight: 8 }}>{item.label} <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.count}</Text></Text>
                ))}
              </View>
              <TouchableOpacity style={styles.viewChartButton} onPress={() => { setSelectedSeverity('high'); setShowPieModal(true); }}>
                <Text style={styles.viewChartButtonText}>View Chart</Text>
              </TouchableOpacity>
            </View>
            {/* Medium */}
            <View style={[styles.breakdownCard, { borderColor: riskColors.medium }]}> 
              <View style={styles.breakdownCardHeader}>
                <Text style={[styles.breakdownCardTitle, { color: riskColors.medium }]}>Defects on Medium</Text>
                <Text style={styles.breakdownTotal}>Total: {DEFECTS.medium.total}</Text>
              </View>
              <View style={styles.breakdownList}>
                {DEFECTS.medium.breakdown.map((item, i) => (
                  <Text key={item.label + i} style={{ color: item.color, fontWeight: 'bold', marginRight: 8 }}>{item.label} <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.count}</Text></Text>
                ))}
              </View>
              <TouchableOpacity style={styles.viewChartButton} onPress={() => { setSelectedSeverity('medium'); setShowPieModal(true); }}>
                <Text style={styles.viewChartButtonText}>View Chart</Text>
              </TouchableOpacity>
            </View>
            {/* Low */}
            <View style={[styles.breakdownCard, { borderColor: riskColors.low }]}> 
              <View style={styles.breakdownCardHeader}>
                <Text style={[styles.breakdownCardTitle, { color: riskColors.low }]}>Defects on Low</Text>
                <Text style={styles.breakdownTotal}>Total: {DEFECTS.low.total}</Text>
              </View>
              <View style={styles.breakdownList}>
                {DEFECTS.low.breakdown.map((item, i) => (
                  <Text key={item.label + i} style={{ color: item.color, fontWeight: 'bold', marginRight: 8 }}>{item.label} <Text style={{ color: '#222', fontWeight: 'normal' }}>{item.count}</Text></Text>
                ))}
              </View>
              <TouchableOpacity style={styles.viewChartButton} onPress={() => { setSelectedSeverity('low'); setShowPieModal(true); }}>
                <Text style={styles.viewChartButtonText}>View Chart</Text>
              </TouchableOpacity>
            </View>
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
                <Text style={styles.modalTitle}>Status Breakdown for {selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)}</Text>
                <DefectPieChart
                  title="Status Breakdown"
                  data={DEFECTS[selectedSeverity].breakdown.map(item => ({
                    label: item.label,
                    value: item.count,
                    color: item.color,
                    percentage: DEFECTS[selectedSeverity].total > 0 ? (item.count / DEFECTS[selectedSeverity].total) * 100 : 0
                  }))}
                  totalLabel="TOTAL DEFECTS"
                  totalValue={DEFECTS[selectedSeverity].total}
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
            <View style={[styles.summaryCard, { paddingTop: 40, paddingBottom: 40, minHeight: 220 }]}> 
              <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, textAlign: 'center', color:'#14316e' }}>
                Defect Density: <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 24 }}>{4.36}</Text>
              </Text>
              {/* Gauge meter below (reuse DefectDensityMeter or custom meter) */}
              <DefectDensityMeter defectDensity={4.36} />
            </View>
        {/* Defect Severity Index - Updated to match screenshot */}
        <View style={[styles.summaryCard, { minHeight: 180, alignItems: 'center', justifyContent: 'center', paddingTop: 32, paddingBottom: 32 }]}> 
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8, color: 'rgba(24,52,90,0.85)', textAlign: 'center' }}>
            Defect Severity Index
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
            <View style={{ alignItems: 'center', marginRight: 18 }}>
              <View style={{ width: 28, height: 100, backgroundColor: '#f1f5f9', borderRadius: 14, justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' }}>
                <View style={{ width: 28, height: 62, backgroundColor: '#ef4444', borderRadius: 14 }} />
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
              <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#ef4444', textAlign: 'center', marginBottom: 2 }}>62.5</Text>
              <Text style={{ fontSize: 15, color: '#64748b', textAlign: 'center', maxWidth: 180 }}>
                Weighted severity score (higher = more severe defects)
              </Text>
            </View>
          </View>
        </View>
            {/* Defect to Remark Ratio */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Defect to Remark Ratio</Text>
              <View style={styles.ratioBox}>
                <Text style={styles.ratioValue}>44.44%</Text>
                <Text style={styles.ratioDesc}>Defect to Remark Ratio (%)</Text>
                <View style={styles.ratioBadge}><Text style={styles.ratioBadgeText}>High</Text></View>
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
              totalValue={459}
              mostCommonLabel="Most Common Functionality"
              mostCommonValue={245}
            />
            <DefectPieChart
              title="Defects by Module"
              data={defectsByModuleData}
              totalLabel="TOTAL DEFECTS"
              totalValue={370}
            />
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
