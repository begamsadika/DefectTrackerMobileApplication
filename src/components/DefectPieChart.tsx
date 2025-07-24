import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart';

interface PieData {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface DefectPieChartProps {
  title: string;
  data: PieData[];
  totalLabel: string;
  totalValue: number;
  mostCommonLabel?: string;
  mostCommonValue?: number;
}

const DefectPieChart: React.FC<DefectPieChartProps> = ({
  title,
  data,
  totalLabel,
  totalValue,
  mostCommonLabel,
  mostCommonValue,
}) => {
  const widthAndHeight = 220;
  const series = data.map(d => ({ value: d.value, color: d.color }));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        style={{ marginBottom: 8 }}
      />
      <View style={styles.legendWrap}>
        {data.map((d, i) => (
          <View key={d.label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: d.color }]} />
            <Text style={styles.legendText}>
              {d.label}: <Text style={styles.legendValue}>{d.value}</Text>
              {d.percentage !== undefined && (
                <Text style={styles.legendPercent}> ({d.percentage}%)</Text>
              )}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.totalsRow}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.totalValue}>{totalValue}</Text>
          <Text style={styles.totalLabel}>{totalLabel}</Text>
        </View>
        {mostCommonLabel && mostCommonValue !== undefined && (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.totalValue}>{mostCommonValue}</Text>
            <Text style={styles.totalLabel}>{mostCommonLabel}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    alignItems: 'center',
    width: 350,
    alignSelf: 'center',
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  legendWrap: {
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#222',
  },
  legendValue: {
    fontWeight: 'bold',
    color: '#222',
  },
  legendPercent: {
    color: '#64748b',
    fontSize: 13,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  totalLabel: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default DefectPieChart;
