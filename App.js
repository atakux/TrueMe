import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/utils/AuthContext';

import LaunchScreen from './src/authentication/LaunchScreen';
import LoginScreen from './src/authentication/LoginScreen';
import SignupScreen from './src/authentication/SignupScreen';
import TabBar from './src/utils/TabBar';

const Stack = createStackNavigator();

// TODO: figure out how to store user login info to store previous session

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer style={styles.container}>
        <Stack.Navigator>
          <Stack.Screen name="LaunchScreen" component={LaunchScreen} options={{headerShown: false}}/>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen name="SignupScreen" component={SignupScreen} options={{headerShown: false}}/>
          <Stack.Screen name="HomeScreen" component={TabBar} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
