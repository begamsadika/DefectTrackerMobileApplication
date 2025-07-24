
import React, { useState } from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';

const PROJECTS = [
  { name: 'Defect Tracker', risk: 'high' },
  { name: 'QA testing', risk: 'high' },
  { name: 'project 1', risk: 'low' },
  { name: 'Heart', risk: 'low' },
  { name: 'Dashbord testing', risk: 'low' },
  { name: 'JALI', risk: 'low' },
  { name: 'Hello world', risk: 'low' },
  { name: 'dashborad test', risk: 'high' },
];

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
  const route = useRoute();
  // @ts-ignore
  const { project: initialProject } = route.params || {};
  const [selectedProject, setSelectedProject] = useState(initialProject || PROJECTS[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<'high' | 'medium' | 'low'>('high');

  const risk = selectedProject.risk as 'high' | 'medium' | 'low';
  const defects = DEFECTS[risk];

  const openChartModal = (severity: 'high' | 'medium' | 'low') => {
    setSelectedSeverity(severity);
    setModalVisible(true);
  };

  // Pie chart using react-native-svg and react-native-svg-charts

  const renderPieChart = (data: any[]) => {
    // Pie chart fallback using SVG
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const radius = 80;
    const center = radius + 10;
    let cumulativeAngle = 0;
    const slices = data.map((item, idx) => {
      const value = item.count;
      const angle = total ? (value / total) * 360 : 0;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle += angle;
      // Convert angles to radians
      const startRad = (Math.PI / 180) * startAngle;
      const endRad = (Math.PI / 180) * endAngle;
      // Calculate coordinates
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);
      // Large arc flag
      const largeArcFlag = angle > 180 ? 1 : 0;
      // Path string
      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');
      return (
        <Path key={item.label} d={pathData} fill={item.color} />
      );
    });
    return (
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Svg width={center * 2} height={center * 2}>
          <G>{slices}</G>
        </Svg>
      </View>
    );
  };

  const renderPieChartModal = () => {
    const severityData = DEFECTS[selectedSeverity];
    const filteredData = severityData.breakdown.filter(item => item.count > 0);

    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              Status Breakdown for {selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)}
            </Text>

            {/* Pie chart removed as requested */}

            {/* Legend row below chart, matching screenshot */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
              {filteredData.map((item, idx) => (
                <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18, marginBottom: 8 }}>
                  <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: item.color, marginRight: 6 }} />
                  <Text style={{ fontSize: 15, color: '#222', fontWeight: 'bold' }}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <ScrollView style={styles.page}>
      {renderPieChartModal()}
      {/* Project Selection Horizontal Scroll */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>Project Selection</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
          {PROJECTS.map((proj, idx) => (
            <TouchableOpacity
              key={proj.name + idx}
              style={[styles.chip, selectedProject.name === proj.name ? styles.chipActive : null]}
              onPress={() => setSelectedProject(proj)}
            >
              <Text style={[styles.chipText, selectedProject.name === proj.name ? styles.chipTextActive : null]}>{proj.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Project Info Card */}
      <View style={styles.infoCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.projectTitle}>{selectedProject.name}</Text>
          <View style={[styles.statusCard, { backgroundColor: riskColors[risk as 'high' | 'medium' | 'low'] + '22' }]}> 
            <Text style={[styles.statusText, { color: riskColors[risk as 'high' | 'medium' | 'low'] }]}>{riskLabels[risk as 'high' | 'medium' | 'low']}</Text>
          </View>
        </View>
      </View>

      {/* Defect Severity Breakdown */}
      <Text style={styles.breakdownTitle}>Defect Severity Breakdown</Text>
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
          <TouchableOpacity style={styles.chartBtn} onPress={() => openChartModal('high')}>
            <Text style={styles.chartBtnText}>View Chart</Text>
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
          <TouchableOpacity style={styles.chartBtn} onPress={() => openChartModal('medium')}>
            <Text style={styles.chartBtnText}>View Chart</Text>
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
          <TouchableOpacity style={styles.chartBtn} onPress={() => openChartModal('low')}>
            <Text style={styles.chartBtnText}>View Chart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Cards Row BELOW Defect Severity Breakdown */}
      <View style={styles.summaryCol}>
        {/* Defect Density */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Defect Density</Text>
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <Text style={styles.summaryLabel}>Defect Density: <Text style={styles.densityValue}>8.00</Text></Text>
            {/* Simple Gauge Representation */}
            <View style={styles.gaugeWrap}>
              <View style={styles.gaugeBase}>
                <View style={[styles.gaugeArc, styles.gaugeArcGreen]} />
                <View style={[styles.gaugeArc, styles.gaugeArcYellow]} />
                <View style={[styles.gaugeArc, styles.gaugeArcRed]} />
                <View style={styles.gaugeNeedle} />
              </View>
              <View style={styles.gaugeLabels}>
                <Text style={styles.gaugeLabel}>0</Text>
                <Text style={styles.gaugeLabel}>7</Text>
                <Text style={styles.gaugeLabel}>10</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Defect Severity Index */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Defect Severity Index</Text>
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <View style={styles.severityBarWrap}>
              <View style={styles.severityBar} />
            </View>
            <Text style={styles.severityValue}>135.9</Text>
            <Text style={styles.severityDesc}>Weighted severity score (higher = more severe defects)</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    color: '#222',
    marginBottom: 4,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  densityValue: {
    color: '#facc15',
    fontWeight: 'bold',
    fontSize: 18,
  },
  gaugeWrap: {
    marginTop: 8,
    alignItems: 'center',
    width: 120,
    height: 70,
  },
  gaugeBase: {
    position: 'relative',
    width: 120,
    height: 60,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeArc: {
    position: 'absolute',
    width: 120,
    height: 60,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: '#eee',
  },
  gaugeArcGreen: {
    borderTopColor: '#22c55e',
    left: 0,
    top: 0,
    width: 40,
  },
  gaugeArcYellow: {
    borderTopColor: '#facc15',
    left: 40,
    top: 0,
    width: 40,
  },
  gaugeArcRed: {
    borderTopColor: '#ef4444',
    left: 80,
    top: 0,
    width: 40,
  },
  gaugeNeedle: {
    position: 'absolute',
    left: 60,
    top: 10,
    width: 2,
    height: 40,
    backgroundColor: '#222',
    borderRadius: 2,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginTop: 2,
  },
  gaugeLabel: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'bold',
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
    color: '#222',
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
    backgroundColor: '#6366f1',
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
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 14,
    padding: 18,
    elevation: 2,
    marginBottom: 16,
  },
  projectTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  statusCard: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 18,
    marginBottom: 12,
  },
  breakdownCol: {
    flexDirection: 'column',
    marginHorizontal: 8,
    marginBottom: 24,
    gap: 12,
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
  chartBtn: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  chartBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#64748b',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  pieChartContainer: {
    width: 200,
    alignItems: 'center',
  },
  pieSliceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  pieSlice: {
    borderRadius: 4,
    marginRight: 8,
  },
  pieSliceText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
});

export default ProjectDetails;
