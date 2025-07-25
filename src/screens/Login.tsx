import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Platform.OS === 'ios' ? '#e0e7ff' : '#dbeafe',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    backgroundColor: '#e0e7ff',
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
    marginLeft: 8, // increased left margin
    alignSelf: 'flex-start',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    marginBottom: 16,
    height: 48,
    paddingHorizontal: 8,
  },
  inputIcon: {
    marginRight: 8,
    color: '#64748b',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#222',
    height: 48,
    paddingLeft: 0,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
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
    paddingVertical: 0,
    minHeight: 48,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 1,
  },
  demoBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    width: '100%',
  },
  demoTitle: {
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
    fontSize: 15,
  },
  demoText: {
    color: '#64748b',
    fontSize: 14,
  },
});


import { useNavigation } from '@react-navigation/native';

function Login(props) {
  const navigation = props.navigation || useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }
    // Dummy authentication logic
    navigation && navigation.navigate('Dashboard');
  };

  return (
    <ImageBackground
      source={require('../assets/Home.jpg')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      imageStyle={{ opacity: 0.18 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.pageTitle}>DefectTracker Pro</Text>
          <Text style={styles.pageSubtitle}>Sign in to your account</Text>

          <View style={[styles.card, { marginTop: 16 }]}> {/* Add margin above card */}
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputRow}>
              <Icon name="mail" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#94a3b8"
              />
            </View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Icon name="lock" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.optionsRow}>
              <View style={styles.checkboxRow}>
                {/* ...existing code... */}
              </View>
            </View>
            <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 20, marginTop: -20 }}>
              <Text style={styles.forgotText}>Forgot Your Username or Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[styles.button, { backgroundColor: '#10b981', marginBottom: 8 }]}
              onPress={() => navigation && navigation.navigate('IconTest')}
            >
              <Text style={styles.buttonText}>Test Icons</Text>
            </TouchableOpacity> */}

            {/* <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoText}>Username: admin</Text>
              <Text style={styles.demoText}>Password: admin</Text>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default Login