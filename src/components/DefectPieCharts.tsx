import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface PieChartData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface DefectPieChartProps {
  title: string;
  data: PieChartData[];
  totalLabel?: string;
  totalValue?: number;
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
  const chartSize = 160;
  const radius = chartSize / 2;

  // Filter out zero values
  const filteredData = data.filter(item => item.value > 0);

  // Calculate cumulative angles for pie slices
  let cumulativeAngle = 0;
  const segments = filteredData.map((item) => {
    const startAngle = cumulativeAngle;
    const angle = (item.percentage / 100) * 360;
    cumulativeAngle += angle;

    return {
      ...item,
      startAngle,
      angle,
      endAngle: cumulativeAngle,
    };
  });

  // Create proper pie chart using SVG
  const createPieSlice = (segment: any, index: number) => {
    const { startAngle, angle, color } = segment;
    const centerX = radius;
    const centerY = radius;
    const outerRadius = radius - 10;

    // Convert angles to radians (subtract 90 to start from top)
    const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
    const endAngleRad = ((startAngle + angle - 90) * Math.PI) / 180;

    // Calculate arc endpoints
    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);

    // Large arc flag
    const largeArcFlag = angle > 180 ? 1 : 0;

    // Create SVG path for pie slice
    const pathData = [
      `M ${centerX} ${centerY}`, // Move to center
      `L ${x1} ${y1}`, // Line to start point
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc to end point
      'Z' // Close path
    ].join(' ');

    return (
      <Path
        key={segment.label}
        d={pathData}
        fill={color}
        stroke="#fff"
        strokeWidth="2"
      />
    );
  };

  const renderPieChart = () => {
    return (
      <Svg width={chartSize} height={chartSize}>
        {segments.map((segment, index) => createPieSlice(segment, index))}
      </Svg>
    );
  };

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      
      <View style={styles.chartContainer}>
        {renderPieChart()}
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        {filteredData.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.label} {item.value} ({item.percentage.toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
      
      {/* Bottom stats */}
      <View style={styles.statsContainer}>
        {totalLabel && totalValue !== undefined && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalValue}</Text>
            <Text style={styles.statLabel}>{totalLabel}</Text>
          </View>
        )}
        {mostCommonLabel && mostCommonValue !== undefined && (
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#2563eb' }]}>{mostCommonValue}</Text>
            <Text style={styles.statLabel}>{mostCommonLabel}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8, // reduce vertical padding
    paddingHorizontal: 16, // keep horizontal padding reasonable
    marginVertical: 4, // reduce vertical margin
    marginHorizontal: 0, // Remove horizontal margin to match ratio card width
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14316e',
    marginBottom: 20,
    textAlign: 'center',
    marginTop:10,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pieChart: {
    position: 'relative',
  },
  baseCircle: {
    backgroundColor: '#f8fafc',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pieSegment: {
    position: 'absolute',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  connectingLine: {
    position: 'absolute',
    opacity: 0.6,
    transformOrigin: 'top center',
  },
  connectingWedge: {
    position: 'absolute',
    transformOrigin: 'top center',
  },
  centerCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    top: 50,
    left: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  centerContent: {
    alignItems: 'center',
  },
  legend: {
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default DefectPieChart;
