import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput } from 'react-native';
import Login from './Login';

import LoginScreen from './Login';

const Home = ({ navigation }) => {
  return (
    <ImageBackground source={require('../assets/Defect-Tracking-Tools.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Defect Tracker</Text>
          <TouchableOpacity style={styles.iconContainer}>
            <Image source={require('../assets/user.png')} style={styles.userIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <LoginScreen navigation={navigation} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(244,247,254,0.7)',
    justifyContent: 'flex-start',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaf1ff',
    elevation: 2,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  iconContainer: {
    padding: 4,
  },
  userIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 0,
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  inputWrapper: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f8fafc',
    marginBottom: 0,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  rememberMeText: {
    color: '#222',
    fontSize: 14,
  },
  forgotText: {
    color: '#2563eb',
    fontWeight: '500',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1,
  },
});

export default Home;
