import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './src/screens/Welcome';
import Home from './src/screens/Home';
import Dashboard from './src/screens/Dashboard';
import Authorization from './src/screens/Authorization';
//import IconTest from './src/screens/IconTest';
import ProjectDetails from './src/screens/ProjectDetails';
import Settings from './src/screens/Settings';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="Authorization" component={Authorization} options={{ headerShown: false  }} />
        {/* <Stack.Screen name="IconTest" component={IconTest} options={{ title: 'Icon Test' }} /> */}
        <Stack.Screen name="ProjectDetails" component={ProjectDetails} options={{ title: 'Project Details' }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false  }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
