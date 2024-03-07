import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/utils/AuthContext';

import LaunchScreen from './src/authentication/LaunchScreen';
import LoginScreen from './src/authentication/LoginScreen';
import SignupScreen from './src/authentication/SignupScreen';
import AddRoutine from './src/components/RoutinesScreens/AddRoutine';
import Routine from './src/components/RoutinesScreens/Routine';
import EditRoutine from './src/components/RoutinesScreens/EditRoutine';
import EditAccount from './src/components/AccountSettings/EditAccount';
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
          <Stack.Screen name="AddRoutine" component={AddRoutine} options={{headerShown: false}}/>
          <Stack.Screen name="Routine" component={Routine} options={{headerShown: false}}/>
          <Stack.Screen name="EditRoutine" component={EditRoutine} options={{headerShown: false}}/>
          <Stack.Screen name="EditAccount" component={EditAccount} options={{headerShown: false}}/>
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


// Ignore warning about unserializable values. 
/* if needed for state persistence or deep link, have to remove warning and fix: 
      HomeScreen.js, AddRoutine.js, RoutineContext.js
      
      https://reactnavigation.org/docs/troubleshooting/
    
    probably have to do navigation.setOptions() in some of the screens
*/
const originalWarn = console.warn;

console.warn = (...args) => {
  const [firstArg] = args;
  if (typeof firstArg === 'string' && firstArg.startsWith('Non-serializable values') || firstArg.startsWith('Key "cancelled" in the image picker')) {
    // Suppress the warning
    return;
  }
  // For other warnings, call the original console.warn()
  originalWarn.apply(console, args);
};

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48, use "canceled" instead',
]);
