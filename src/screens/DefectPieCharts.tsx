import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import PieChart from 'react-native-pie-chart';

interface PieSlice {
  value: number;
  color: string;
  label?: {
    text: string;
    fontSize?: number;
    offsetX?: number;
    offsetY?: number;
    fontWeight?: 'bold' | 'normal';
    fontStyle?: 'italic' | 'normal';
    outline?: string;
  };
}

const DefectPieCharts: React.FC = () => {
  const widthAndHeight = 220;

  const reopenedSeries: PieSlice[] = [
    { value: 5, color: '#4285F4', label: { text: '2 times', fontSize: 12 } },
    { value: 1, color: '#fbbc05', label: { text: '4 times', fontSize: 12, offsetY: 10 } },
  ];

  const typeSeries: PieSlice[] = [
    { value: 245, color: '#4285F4', label: { text: 'Functionality', fontSize: 10 } },
    { value: 81, color: '#00bfae', label: { text: 'UI', fontSize: 10 } },
    { value: 30, color: '#fbbc05', label: { text: 'Usability', fontSize: 10 } },
    { value: 103, color: '#ea4335', label: { text: 'Validation', fontSize: 10 } },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.chartBlock}>
        <Text style={styles.title}>Defects Reopened Multiple Times</Text>
        <PieChart widthAndHeight={widthAndHeight} series={reopenedSeries} />
        <Text style={styles.legend}><Text style={{ color: '#4285F4' }}>⬤</Text> 2 times: 5 (83.3%)</Text>
        <Text style={styles.legend}><Text style={{ color: '#fbbc05' }}>⬤</Text> 4 times: 1 (16.7%)</Text>
      </View>

      <View style={styles.chartBlock}>
        <Text style={styles.title}>Defect Distribution by Type</Text>
        <PieChart widthAndHeight={widthAndHeight} series={typeSeries} />
        <Text style={styles.legend}><Text style={{ color: '#4285F4' }}>⬤</Text> Functionality: 245 (53.4%)</Text>
        <Text style={styles.legend}><Text style={{ color: '#00bfae' }}>⬤</Text> UI: 81 (17.6%)</Text>
        <Text style={styles.legend}><Text style={{ color: '#fbbc05' }}>⬤</Text> Usability: 30 (6.5%)</Text>
        <Text style={styles.legend}><Text style={{ color: '#ea4335' }}>⬤</Text> Validation: 103 (22.4%)</Text>
        <Text style={[styles.total, { marginTop: 8 }]}>459 Total Defects</Text>
        <Text style={styles.common}>245 Most Common: Functionality</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  chartBlock: {
    marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
  },
  legend: {
    fontSize: 14,
    marginTop: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
  },
  common: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
  },
});

export default DefectPieCharts;