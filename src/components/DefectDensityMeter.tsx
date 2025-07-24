// DefectDensityMeter.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import RNSpeedometer from 'react-native-speedometer';

interface DefectDensityMeterProps {
  defectDensity?: number;
}

const DefectDensityMeter: React.FC<DefectDensityMeterProps> = ({
  defectDensity = 8.00
}) => {
  const [inputValue, setInputValue] = useState(defectDensity.toString());
  const currentValue = parseFloat(inputValue) || defectDensity;

  // Determine status text and color based on value (Green: 1-7, Yellow: 7-10, Red: 10-12)
  const getStatusInfo = (value: number) => {
    if (value < 7) return { text: 'Good', color: '#22c55e' };
    if (value < 10) return { text: 'Average', color: '#facc15' };
    return { text: 'Poor', color: '#ef4444' };
  };

  const statusInfo = getStatusInfo(currentValue);

  const onChange = (value: string) => setInputValue(value);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Defect Density</Text> */}

      {/* Input for speedometer value */}
      {/* <TextInput
        placeholder="Enter Density Value"
        style={styles.textInput}
        onChangeText={onChange}
        value={inputValue}
        keyboardType="numeric"
      /> */}

      {/* React Native Speedometer */}
      <View style={styles.speedometerContainer}>
        <RNSpeedometer
          value={Math.max(1, Math.min(currentValue, 12))}
          size={200}
          minValue={1}
          maxValue={12}
          allowedDecimals={2}
          labels={[
            {
              name: 'Good',
              labelColor: '#22c55e',
              activeBarColor: '#22c55e',
            },
            {
              name: 'Average',
              labelColor: '#facc15',
              activeBarColor: '#facc15',
            },
            {
              name: 'Poor',
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
