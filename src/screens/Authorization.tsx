import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Authorization = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');

  const handleReset = () => {
    // Implement reset logic here
  };

  return (
    <ImageBackground source={require('../assets/Home.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Icon name="lock" size={40} color="#2563eb" />
            </View>
            <Text style={styles.heading}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email or username to reset your password.</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email or Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email or username"
                placeholderTextColor="#64748b"
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleReset}>
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation && navigation.goBack()}>
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24,52,90,0.85)', // same as Home page overlay
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(30,41,59,0.85)', // semi-transparent dark card
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    marginTop: 32,
    borderWidth: 1,
    borderColor: 'rgba(60,80,120,0.3)',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e7ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#f3f6fb',
    borderWidth: 1,
    borderColor: '#e0e7ef',
    borderRadius: 14,
    marginBottom: 2,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'rgba(30,41,59,0.85)',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1,
  },
  backText: {
    color: '#64748b',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default Authorization;
