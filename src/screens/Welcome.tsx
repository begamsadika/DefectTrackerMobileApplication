import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <ImageBackground source={require('../assets/Home.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>Defect Tracker is Ready</Text>
          <Text style={styles.subtitle}>Let’s find and fix those bugs—together!</Text>
          <TouchableOpacity style={styles.goButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.goButtonText}>Start Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  goButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  goButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Welcome;