import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const IconTest = () => {
  const featherIcons = [
    'alert-circle',
    'check-circle',
    'clock',
    'home',
    'user',
    'settings',
    'star',
    'heart'
  ];

  const materialIcons = [
    'home',
    'person',
    'settings',
    'star',
    'favorite',
    'check',
    'warning',
    'access-time'
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Icon Test Screen</Text>
      
      <Text style={styles.sectionTitle}>Feather Icons</Text>
      <View style={styles.iconGrid}>
        {featherIcons.map((iconName, index) => (
          <View key={index} style={styles.iconItem}>
            <Icon name={iconName} size={32} color="#333" />
            <Text style={styles.iconLabel}>{iconName}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Material Icons</Text>
      <View style={styles.iconGrid}>
        {materialIcons.map((iconName, index) => (
          <View key={index} style={styles.iconItem}>
            <MaterialIcon name={iconName} size={32} color="#333" />
            <Text style={styles.iconLabel}>{iconName}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Fallback Test</Text>
      <View style={styles.iconGrid}>
        <View style={styles.iconItem}>
          <Text style={styles.fallbackIcon}>⚠</Text>
          <Text style={styles.iconLabel}>Warning</Text>
        </View>
        <View style={styles.iconItem}>
          <Text style={styles.fallbackIcon}>✓</Text>
          <Text style={styles.iconLabel}>Check</Text>
        </View>
        <View style={styles.iconItem}>
          <Text style={styles.fallbackIcon}>⏰</Text>
          <Text style={styles.iconLabel}>Clock</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    color: '#333',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  iconItem: {
    alignItems: 'center',
    margin: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 80,
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  fallbackIcon: {
    fontSize: 32,
    color: '#333',
  },
});

export default IconTest;
