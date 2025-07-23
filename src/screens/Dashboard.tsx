import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Icon component with fallback
interface SafeIconProps {
  name: string;
  size?: number;
  color?: string;
  library?: 'Feather' | 'MaterialIcons';
  fallbackText?: string;
}

const SafeIcon: React.FC<SafeIconProps> = ({
  name,
  size = 24,
  color = '#000',
  library = 'Feather',
  fallbackText = '●'
}) => {
  try {
    if (library === 'MaterialIcons') {
      return <MaterialIcon name={name} size={size} color={color} />;
    }
    return <Icon name={name} size={size} color={color} />;
  } catch (error) {
    // Fallback to text if icon fails to load
    return (
      <Text style={{ fontSize: size, color, textAlign: 'center' }}>
        {fallbackText}
      </Text>
    );
  }
};

const PROJECTS = [
  { name: 'Defect Tracker', risk: 'high' },
  { name: 'QA testing', risk: 'high' },
  { name: 'project 1', risk: 'low' },
  { name: 'Heart', risk: 'low' },
  { name: 'Dashbord testing', risk: 'low' },
  { name: 'JALI', risk: 'low' },
  { name: 'Hello world', risk: 'low' },
  { name: 'dashborad test', risk: 'high' },
];

// Risk color mapping from part 2
const riskColors = {
  high: '#c90404',
  medium: '#d9c10d',
  low: '#0b9c40',
};

const Dashboard = () => {
  const [selectedRisk, setSelectedRisk] = React.useState('all');
  const [modalVisible, setModalVisible] = React.useState(false);
  const navigation = useNavigation();

  const filteredProjects = selectedRisk === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.risk === selectedRisk);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalMenu}>
            <TouchableOpacity style={styles.modalMenuItem} onPress={() => { setSelectedRisk('high'); setModalVisible(false); }}>
              <Text style={styles.filterTextRed}>High Risk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalMenuItem} onPress={() => { setSelectedRisk('medium'); setModalVisible(false); }}>
              <Text style={styles.filterTextYellow}>Medium Risk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalMenuItem} onPress={() => { setSelectedRisk('low'); setModalVisible(false); }}>
              <Text style={styles.filterTextGreen}>Low Risk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalMenuItem} onPress={() => { setSelectedRisk('all'); setModalVisible(false); }}>
              <Text style={styles.filterTextDefault}>All Projects</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={styles.overviewTitle}>Dashboard Overview</Text>
      <Text style={styles.overviewSubtitle}>
        Gain insights into your projects with real-time health metrics and status summaries
      </Text>
      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Project Status Insights</Text>
      {/* High Risk Projects Card */}
      <View style={styles.cardsRow}>
        <View style={[styles.card, styles.cardRed]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.cardIconCircleRedCustom, { backgroundColor: riskColors.high }]}> 
              <SafeIcon name="alert-circle" size={24} color="#fff" fallbackText="⚠" />
            </View>
            <Text style={styles.cardTitle}>High Risk Projects</Text>
            <Text style={[styles.cardCountRed, { color: riskColors.high }]}>{PROJECTS.filter(p => p.risk === 'high').length}</Text>
          </View>
          <Text style={[styles.cardStatusRed, { color: riskColors.high }]}>Immediate attention required</Text>
        </View>
      </View>
      {/* Medium Risk Projects Card */}
      <View style={styles.cardsRow}>
        <View style={[styles.card, styles.cardYellow]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.cardIconCircleYellow, { backgroundColor: riskColors.medium }]}> 
              <SafeIcon name="clock" size={24} color="#fff" fallbackText="⏰" />
            </View>
            <Text style={styles.cardTitle}>Medium Risk Projects</Text>
            <Text style={[styles.cardCountYellow, { color: riskColors.medium }]}>{PROJECTS.filter(p => p.risk === 'medium').length}</Text>
          </View>
          <Text style={[styles.cardStatusYellow, { color: riskColors.medium }]}>Monitor progress closely</Text>
        </View>
      </View>
      {/* Low Risk Projects Card */}
      <View style={styles.cardsRow}>
        <View style={[styles.card, styles.cardGreen]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.cardIconCircleGreen, { backgroundColor: riskColors.low }]}> 
              <SafeIcon name="check-circle" size={24} color="#fff" fallbackText="✓" />
            </View>
            <Text style={styles.cardTitle}>Low Risk Projects</Text>
            <Text style={[styles.cardCountGreen, { color: riskColors.low }]}>{PROJECTS.filter(p => p.risk === 'low').length}</Text>
          </View>
          <Text style={[styles.cardStatusGreen, { color: riskColors.low }]}>Stable and on track</Text>
        </View>
      </View>

      <View style={{marginBottom: 24}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>All Projects</Text>
          <TouchableOpacity style={styles.menuDots} onPress={() => setModalVisible(true)}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
        <View style={styles.circleGrid}>
          {filteredProjects.map((project, idx) => {
            let cardStyle, labelStyle, labelText;
            if (project.risk === 'high') {
              cardStyle = [styles.circleRed, { backgroundColor: riskColors.high, borderColor: riskColors.high }];
              labelStyle = styles.circleLabelRed;
              labelText = 'High Risk';
            } else if (project.risk === 'medium') {
              cardStyle = [styles.circleYellow, { backgroundColor: riskColors.medium, borderColor: riskColors.medium }];
              labelStyle = styles.circleLabelYellow;
              labelText = 'Medium Risk';
            } else {
              cardStyle = [styles.circleGreen, { backgroundColor: riskColors.low, borderColor: riskColors.low }];
              labelStyle = styles.circleLabelGreen;
              labelText = 'Low Risk';
            }
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.circleCard, cardStyle]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ProjectDetails', { project })}
              >
                <SafeIcon
                  name={project.risk === 'high' ? 'alert-circle' : project.risk === 'medium' ? 'clock' : 'check-circle'}
                  size={40}
                  color="#fff"
                  fallbackText={project.risk === 'high' ? '⚠' : project.risk === 'medium' ? '⏰' : '✓'}
                />
                <Text style={styles.circleTitle}>{project.name}</Text>
                <View style={labelStyle}><Text style={styles.circleLabelText}>{labelText}</Text></View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 2,
    gap: 8,
  },
  cardIconCircleRedCustom: {
    borderRadius: 50,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  overviewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 4,
  },
  overviewSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 6,
  },
  sectionDivider: {
    height: 2,
    width: 40,
    backgroundColor: '#a5b4fc',
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    marginLeft: 2,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 0,
    gap: 12,
  },
  card: {
    width: '85%',
    minHeight: 70,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginHorizontal: 0,
    marginVertical: 1,
  },
  cardRed: {
    borderColor: '#ef4444',
  },
  cardYellow: {
    borderColor: '#facc15',
  },
  cardGreen: {
    borderColor: '#22c55e',
  },
  cardIconCircleYellow: {
    borderRadius: 50,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardIconCircleGreen: {
    borderRadius: 50,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
    textAlign: 'center',
  },
  cardCountRed: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  cardCountYellow: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  cardCountGreen: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  cardStatusRed: {
    fontSize: 13,
    textAlign: 'center',
  },
  cardStatusYellow: {
    fontSize: 13,
    textAlign: 'center',
  },
  cardStatusGreen: {
    fontSize: 13,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterTextRed: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  filterTextYellow: {
    color: '#facc15',
    fontWeight: 'bold',
  },
  filterTextGreen: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  filterTextDefault: {
    color: '#222',
    fontWeight: 'bold',
  },
  circleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    gap: 12,
  },
  circleCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 75,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 3,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  circleRed: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  circleYellow: {
    backgroundColor: '#facc15',
    borderColor: '#facc15',
  },
  circleGreen: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  circleTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
    textAlign: 'center',
  },
  circleLabelRed: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  circleLabelYellow: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  circleLabelGreen: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  circleLabelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  menuDots: {
    position: 'absolute',
    top: 18,
    right: 18,
    flexDirection: 'row',
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#222',
    marginHorizontal: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMenu: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    minWidth: 180,
    alignItems: 'center',
    elevation: 8,
  },
  modalMenuItem: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
});

export default Dashboard;