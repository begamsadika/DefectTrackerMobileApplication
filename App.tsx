
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import Dashboard from './src/screens/Dashboard';
import IconTest from './src/screens/IconTest';
import ProjectDetails from './src/screens/ProjectDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="IconTest" component={IconTest} options={{ title: 'Icon Test' }} />
        <Stack.Screen name="ProjectDetails" component={ProjectDetails} options={{ title: 'Project Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
