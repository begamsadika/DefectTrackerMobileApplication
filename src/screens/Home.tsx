import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

// Define navigation type for Home
// Replace 'RootStackParamList' with your actual stack param list if different
type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface HomeProps {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const handleLogin = () => {
    let valid = true;
    if (!username.trim()) {
      setUsernameError('Please fill out this field.');
      valid = false;
    } else {
      setUsernameError('');
    }
    if (!password.trim()) {
      setPasswordError('Please fill out this field.');
      valid = false;
    } else {
      setPasswordError('');
    }
    if (valid) {
      navigation.navigate('Dashboard');
    }
  };

  return (
    <ImageBackground source={require('../assets/Home.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.backButton}>
            <Icon name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.headingSS}>DEFECT TRACKER</Text>
          <View style={styles.card}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatarCircle}>
                <Image source={require('../assets/user.png')} style={styles.avatarIcon} />
              </View>
            </View>
            {/* Login Form */}
            <Text style={styles.title}>Sign In</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[styles.input, usernameError ? styles.inputError : null]}
                placeholder="Enter your username"
                placeholderTextColor="#b6c2d6"
                value={username}
                onChangeText={text => {
                  setUsername(text);
                  if (usernameError && text.trim()) setUsernameError('');
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {usernameError ? (
                <View style={styles.errorTooltipWrap}>
                  <View style={styles.errorTooltip}>
                    <Icon name="alert-triangle" size={18} color="#f59e42" style={{marginRight: 6}} />
                    <Text style={styles.errorText}>{usernameError}</Text>
                  </View>
                </View>
              ) : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                placeholder="Enter your password"
                placeholderTextColor="#b6c2d6"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (passwordError && text.trim()) setPasswordError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {passwordError ? (
                <View style={styles.errorTooltipWrap}>
                  <View style={styles.errorTooltip}>
                    <Icon name="alert-triangle" size={18} color="#f59e42" style={{marginRight: 6}} />
                    <Text style={styles.errorText}>{passwordError}</Text>
                  </View>
                </View>
              ) : null}
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && { backgroundColor: '#2563eb', borderColor: '#2563eb' }]}> 
                  {rememberMe && (
                    <Icon name="check" size={18} color="#fff" />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Authorization')}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(24,52,90,0.85)', // deep blue overlay
    justifyContent: 'flex-start',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  headingSS: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 18,
    letterSpacing: 2,
    textTransform: 'uppercase',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
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
    color: 'white',
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
    color: '#fff',
    backgroundColor: 'rgba(30,41,59,0.85)',
    borderWidth: 1,
    borderColor: '#3b4a5a',
    borderRadius: 14,
    marginBottom: 2,
  },
  inputError: {
    borderColor: '#f59e42',
    shadowColor: '#f59e42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  errorTooltipWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  errorTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f59e42',
    position: 'absolute',
    top: -38,
    left: 16,
    zIndex: 10,
  },
  errorText: {
    color: '#222',
    fontSize: 14,
    fontWeight: '500',
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
    color: '#b6c2d6',
    fontSize: 14,
  },
  forgotText: {
    color: '#b6c2d6',
    fontWeight: '500',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'rgba(30,41,59,0.85)', // matches card background
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1,
  },
  avatarWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(60,80,120,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(120,140,180,0.3)',
  },
  avatarIcon: {
    width: 40,
    height: 40,
    tintColor: '#b6c2d6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Home;
