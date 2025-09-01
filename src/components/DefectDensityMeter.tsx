// DefectDensityMeter.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import RNSpeedometer from 'react-native-speedometer';

interface DefectDensityMeterProps {
  defectDensity?: number;
}

const DefectDensityMeter: React.FC<DefectDensityMeterProps> = ({
  defectDensity,
}) => {
  const currentValue = defectDensity !== undefined && defectDensity !== null ? defectDensity : 0;

  // Determine status text and color based on value (Green: 0-7, Yellow: 7-10, Red: 10-12)
  const getStatusInfo = (value: number) => {
    if (value <= 7.0) return { text: 'Good', color: '#22c55e' };
    if (value <= 10.0) return { text: 'Medium', color: '#facc15' };
    return { text: 'High', color: '#ef4444' };
  };

  const statusInfo = getStatusInfo(currentValue);
  const dynamicMaxValue = Math.max(12, Math.ceil(currentValue + 1)); // Ensure maxValue is at least 12 and extends if currentValue is higher

  return (
    <View style={styles.container}>
      <View style={styles.speedometerContainer}>
        <RNSpeedometer
          value={Math.max(0, currentValue)}
          size={200}
          minValue={0}
          maxValue={dynamicMaxValue}
          allowedDecimals={4} // Allow 4 decimal places for the speedometer itself
          labels={[
            {
              name: 'Good',
              labelColor: '#22c55e',
              activeBarColor: '#22c55e',
            },
            {
              name: 'Medium',
              labelColor: '#facc15',
              activeBarColor: '#facc15',
            },
            {
              name: 'High',
              labelColor: '#ef4444',
              activeBarColor: '#ef4444',
            },
          ]}
        />
        
      </View>
    </View>
  );
};

export default DefectDensityMeter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 4,
    elevation: 2,
    alignItems: 'center',
    minHeight: 280,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  textInput: {
    borderBottomWidth: 0.3,
    borderBottomColor: 'black',
    height: 40,
    fontSize: 16,
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    width: '80%',
    textAlign: 'center',
  },
  speedometerContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    position: 'relative', // Needed for absolute positioning of children
  },
  centerTextContainer: {
    position: 'absolute',
    top: '55%', // Adjust as needed to center vertically
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
