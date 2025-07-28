import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ImageBackground, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
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

  // Sort projects: high (red), then medium (yellow), then low (green)
  const riskOrder = { high: 0, medium: 1, low: 2 };
  const filteredProjects = (selectedRisk === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.risk === selectedRisk)
  ).slice().sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);

  return (
    <View style={styles.container}>
      {/* Header with back arrow in blue circle, profile icon, and logout icon at top right */}
      <View style={[styles.blueHeaderSection, { height: 132 }]}> {/* Increased height for more Y axis space */}
        {/* Logout icon at top right corner, above and clear of heading */}
        
        <Text style={styles.bigDefectTracker}>Defect Tracker</Text>
        {/* Profile image overlapping bottom left of header */}
        <View style={styles.headerProfileOverlapWrap}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <View style={styles.headerProfileCircle}>
              <Image
                source={require('../assets/prfile.jpg')}
                style={styles.headerProfileImg}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* Fixed Dashboard Overview Heading */}
      <View style={[styles.fixedOverviewHeader, { marginTop: 38 }]}> {/* Increased marginTop to push down overview */}
        <Text style={styles.overviewTitle}>Dashboard Overview</Text>
        
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 0 }}>
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={[styles.modalOverlay, { justifyContent: 'flex-start', alignItems: 'flex-end' }]} onPress={() => setModalVisible(false)}>
            <View style={[styles.modalMenu, { marginRight: 16, marginTop: 380 }]}> 
              <TouchableOpacity
                style={[styles.modalMenuItem,
                  selectedRisk === 'all' && styles.selectedFilterButton,
                  selectedRisk === 'all' && { borderColor: '#222', backgroundColor: '#e5e7eb' }
                ]}
                onPress={() => { setSelectedRisk('all'); setModalVisible(false); }}>
                <Text style={[{ color: '#222', fontWeight: 'bold' }, selectedRisk === 'all' && { color: '#222' }]}>All Projects</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalMenuItem,
                  selectedRisk === 'high' && styles.selectedFilterButton,
                  selectedRisk === 'high' && { borderColor: '#c90404', backgroundColor: '#fee2e2' }
                ]}
                onPress={() => { setSelectedRisk('high'); setModalVisible(false); }}>
                <Text style={[styles.filterTextRed, selectedRisk === 'high' && { color: '#c90404', fontWeight: 'bold' }]}>High Risk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalMenuItem,
                  selectedRisk === 'medium' && styles.selectedFilterButton,
                  selectedRisk === 'medium' && { borderColor: '#d9c10d', backgroundColor: '#fef9c3' }
                ]}
                onPress={() => { setSelectedRisk('medium'); setModalVisible(false); }}>
                <Text style={[styles.filterTextYellow, selectedRisk === 'medium' && { color: '#d9c10d', fontWeight: 'bold' }]}>Medium Risk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalMenuItem,
                  selectedRisk === 'low' && styles.selectedFilterButton,
                  selectedRisk === 'low' && { borderColor: '#0b9c40', backgroundColor: '#dcfce7' }
                ]}
                onPress={() => { setSelectedRisk('low'); setModalVisible(false); }}>
                <Text style={[styles.filterTextGreen, selectedRisk === 'low' && { color: '#0b9c40', fontWeight: 'bold' }]}>Low Risk</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        <Text style={styles.overviewSubtitle}>
          Gain insights into your projects with real-time health metrics and status summaries
        </Text>
        {/* <View style={styles.sectionDivider} /> */}

        <Text style={[styles.sectionTitless, { marginLeft: 20 }]}>Project Status Insights</Text>
        {/* High Risk Projects Card */}
        <View style={styles.cardsRow}>
          <View style={[styles.card, styles.cardRed]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconCircleRedCustom, { backgroundColor: riskColors.high }]}> 
                <SafeIcon name="alert-circle" size={26} color="#fff" fallbackText="⚠" />
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
          <View style={styles.allProjectsCard}>
            <Text style={[styles.sectionTitles, { marginTop: 0, marginLeft: 16 }]}>All Projects</Text>
            <TouchableOpacity style={styles.ssMenuIcon} onPress={() => setModalVisible(true)}>
              <View style={styles.ssBar1} />
              <View style={styles.ssBar2} />
              <View style={styles.ssBar3} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  fixedOverviewHeader: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 0,
    zIndex: 2,
    elevation: 2,
    borderBottomWidth: 4,
    borderBottomColor: '#061d5bff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 4,
    borderColor: '#061d5bff',
    marginBottom: 18,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',//'#89CFF0'//#87CEEB
  },
  // ssHeaderBg: {
  //   backgroundColor: '#061d5bff',
  //   height: 120,
  //   marginTop: 24,
  //   marginHorizontal: 16,
  //   borderRadius: 0,
  //   position: 'relative',
  //   justifyContent: 'center',
  // },
  // backIconCircleSS: {
  //   width: 44,
  //   height: 44,
  //   borderRadius: 22,
  //   // backgroundColor: '',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginLeft: 8,
  //   marginRight: 12,
  //   elevation: 6,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.10,
  //   shadowRadius: 6,
  // },
  // headerRowSS: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   width: '100%',
  //   paddingTop: 18,
  //   paddingBottom: 8,
  //   paddingLeft: 0,
  //   paddingRight: 0,
  //   zIndex: 2,
  // },
  // headingSS: {
  //   color: '#fff',
  //   fontSize: 34,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   marginLeft: 0,
  //   flex: 1,
  //   letterSpacing: 0.5,
  // },
  // profileCircleSS: {
  //   position: 'absolute',
  //   top: 100,
  //   left: 20,
  //   width: 40,
  //   height: 40,
  //   borderRadius: 35,
  //   backgroundColor: '#fff',
  //   borderWidth: 2,
  //   borderColor: '#061d5bff',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.14,
  //   shadowRadius: 8,
  //   elevation: 6,
  //   zIndex: 10,
  // },
  // profileImgSS: {
  //   width: 30,
  //   height: 30,
  //   borderRadius: 24,
  //   resizeMode: 'cover',
  // },
  headerBg: {
    width: '100%',
    marginTop: 0,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 0,
    backgroundColor: 'rgba(24,52,90,0.85)',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },

  blueHeaderSection: {
    backgroundColor: '#061d5bff',
    height: 120,
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 0,
    position: 'relative',
    justifyContent: 'center',
  },
  bigDefectTracker: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },

headerProfileCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#061d5bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
  },
  headerProfileImg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    resizeMode: 'cover',
  },


headerProfileOverlapWrap: {
    position: 'absolute',
    left: 18,
    bottom: -24, // slightly less overlap so the icon is fully visible
    zIndex: 2,
  },
  heading: {
  color: '#fff',
  fontSize: 28,
  fontWeight: '500',
  textAlign: 'center',      // Center the text horizontally
  marginTop: 4,
  
},

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 4,
    justifyContent: 'space-between',
  },
  headerLeftBelowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 18,
    marginTop: 2,
    gap: 8,
  },
  backIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    marginTop: 12,
    paddingHorizontal: 20,
  },
  profileImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
  },
  // ...existing code...
  headerWelcome: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
  },
  searchBarWrap: {
    marginTop: 12,
    backgroundColor: '#f5f6fa',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingLeft: 8,
    paddingRight: 36,
    backgroundColor: 'transparent',
    height: 48,
  },
  searchIcon: {
    position: 'absolute',
    right: 18,
    top: 13,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  overviewTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
    marginTop:4,
  },
  overviewSubtitle: {
    fontSize: 14,
    color: '#14316e',
    textAlign: 'center',
    marginBottom: 20,
    marginTop:20,
  },
  sectionDivider: {
    height: 2,
    width: 40,
    backgroundColor: '#a5b4fc',
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 10,
  },
  sectionTitless: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    marginLeft: 2,
  },
  sectionTitles: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(30,41,59,0.85)',
    marginBottom: 8,
    marginLeft: 2,
  },
  allProjectsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 18,
    minHeight: 64,
    marginBottom: 32,
    marginTop: 18,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#061d5bff',
  },
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
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 0,
    gap: 12,
    width: '100%',
  },
  card: {
    width: '94%',
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
    borderWidth: 4,
    borderColor: '#e5e7eb',
    marginHorizontal: 8,
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
    color: 'rgba(30,41,59,0.85)',
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
  ssMenuIcon: {
    position: 'absolute',
    top: 10,
    right: 18,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  ssBar1: {
    width: 32,
    height: 4,
    backgroundColor: '#222',
    borderRadius: 2,
    marginBottom: 6,
  },
  ssBar2: {
    width: 32,
    height: 4,
    backgroundColor: '#222',
    borderRadius: 2,
    marginBottom: 6,
  },
  ssBar3: {
    width: 20,
    height: 4,
    backgroundColor: '#222',
    borderRadius: 2,
    alignSelf: 'flex-end',
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
    paddingVertical: 16,
    minWidth: 160,
    alignItems: 'center',
    borderRadius: 28,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFilterButton: {
    borderWidth: 2,
    borderColor: '#222',
    backgroundColor: '#e5e7eb',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Dashboard;