// DefectDensityMeter.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import RNSpeedometer from 'react-native-speedometer';

interface DefectDensityMeterProps {
  defectDensity?: number;
  maxValue?: number;
}

const DefectDensityMeter: React.FC<DefectDensityMeterProps> = ({
  defectDensity = 8.00,
  maxValue = 50
}) => {
  const [inputValue, setInputValue] = useState(defectDensity.toString());
  const currentValue = parseFloat(inputValue) || defectDensity;

  // Determine status text and color based on value
  const getStatusInfo = (value: number) => {
    if (value <= 10) return { text: 'Very Good', color: '#22c55e' };
    if (value <= 20) return { text: 'Good', color: '#84cc16' };
    if (value <= 30) return { text: 'Average', color: '#facc15' };
    if (value <= 40) return { text: 'Poor', color: '#f97316' };
    return { text: 'Very Poor', color: '#ef4444' };
  };

  const statusInfo = getStatusInfo(currentValue);

  const onChange = (value: string) => setInputValue(value);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Defect Density</Text>

      {/* Input for speedometer value */}
      <TextInput
        placeholder="Enter Density Value"
        style={styles.textInput}
        onChangeText={onChange}
        value={inputValue}
        keyboardType="numeric"
      />

      {/* React Native Speedometer */}
      <View style={styles.speedometerContainer}>
        <RNSpeedometer
          value={currentValue}
          size={200}
          minValue={0}
          maxValue={maxValue}
          allowedDecimals={2}
          labels={[
            {
              name: 'Very Good',
              labelColor: '#22c55e',
              activeBarColor: '#22c55e',
            },
            {
              name: 'Good',
              labelColor: '#84cc16',
              activeBarColor: '#84cc16',
            },
            {
              name: 'Average',
              labelColor: '#facc15',
              activeBarColor: '#facc15',
            },
            {
              name: 'Poor',
              labelColor: '#f97316',
              activeBarColor: '#f97316',
            },
            {
              name: 'Very Poor',
              labelColor: '#ef4444',
              activeBarColor: '#ef4444',
            },
          ]}
        />

        {/* Status display below speedometer */}
        <View style={styles.statusContainer}>
          <Text style={styles.centerValue}>{currentValue.toFixed(2)}</Text>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>
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
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 20,
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
