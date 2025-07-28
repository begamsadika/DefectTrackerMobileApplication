import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Settings = () => {
  const navigation = require('@react-navigation/native').useNavigation();
  // Example profile data (replace with real data if available)
  const user = {
    name: 'Olivia thomas',
    email: 'oliviathomas06@gmail.com',
    image: require('../assets/prfile.jpg'),
  };
  const menuOptions = [
    { label: 'My Profile', icon: 'user' },
    { label: 'Settings', icon: 'settings' },
    { label: 'Notifications', icon: 'bell' },
    { label: 'Transaction History', icon: 'clock' },
    { label: 'FAQ', icon: 'message-circle' },
    { label: 'About App', icon: 'info' },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.headingProfile}>Profile Information</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image source={user.image} style={styles.profileImage} />
          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
        </View>
        <View style={styles.menuList}>
          {menuOptions.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem}>
              <Icon name={item.icon} size={22} color="#222" style={styles.menuIcon} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          {/* Logout as last menu item, styled in red */}
          <TouchableOpacity style={[styles.menuItem, styles.menuItemLogout]} onPress={() => navigation.navigate('Home')}>
            <Icon name="log-out" size={22} color="#ef4444" style={styles.menuIcon} />
            <Text style={styles.menuLabelLogout}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItemLogout: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  menuLabelLogout: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  logoutBtnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutBtnIconFull: {
    marginRight: 12,
    color: '#fff',
  },
  logoutBtnTextFull: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headingProfile: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#14316e',
    textAlign: 'left',
    marginTop: 32,
    marginLeft: 22,
    marginBottom: 0,
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerIconBtn: {
    padding: 6,
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 12,
    marginTop:40,
    marginLeft:18,
    marginRight:18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  profileImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#14316e',
  },
  profileTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#14316e',
    marginBottom: 2,
  },
  menuList: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 18,
    paddingVertical: 8,
    paddingHorizontal: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f6fa',
  },
  menuIcon: {
    marginRight: 18,
  },
  menuLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  logoutRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
  },
  logoutBtnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutBtnIcon: {
    marginRight: 8,
  },
  logoutBtnText: {
    fontSize: 18,
    color: '#ef4444',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
});

export default Settings;
