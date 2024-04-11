import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/utils/AuthContext';
import { DataProvider } from './src/utils/DataContext';

import LaunchScreen from './src/authentication/LaunchScreen';
import LoginScreen from './src/authentication/LoginScreen';
import SignupScreen from './src/authentication/SignupScreen';
import AddRoutine from './src/components/RoutinesScreens/AddRoutine';
import Routine from './src/components/RoutinesScreens/Routine';
import EditRoutine from './src/components/RoutinesScreens/EditRoutine';
import SuggestedRoutine from './src/components/RoutinesScreens/SuggestedRoutine';
import EditAccount from './src/components/AccountSettings/EditAccount';
import GetStarted from './src/components/SkinScreens/GetStarted';
import DiagnosticScreen from './src/components/SkinScreens/DiagnosticScreen';
import ResultScreen from './src/components/SkinScreens/ResultScreen';
import TabBar from './src/utils/TabBar';
import LoadingAnalysis from './src/components/SkinScreens/LoadingAnalysis';
import AppLoading from './src/components/MainScreens/AppLoading';
import ForgotPasswordScreen from './src/components/AccountSettings/ForgotPassword';
import AboutUs from './src/components/MainScreens/AboutUs';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error retrieving user from storage:', error);
      }
    };

    checkUser();
  }, []);

  return (
    <DataProvider>
      <AuthProvider user = {user}>
        <NavigationContainer style={styles.container}>
          <Stack.Navigator>
            {/* If the user is already logged in, navigate to the HomeScreen directly */}
            {user ? (
              <Stack.Screen
                name="HomeScreenLoggedIn"
                component={TabBar}
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen
                name="LaunchScreen"
                component={LaunchScreen}
                options={{ headerShown: false }}
              />
            )}
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LaunchScreenLoggedOut" component={LaunchScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeScreen" component={TabBar} options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddRoutine" component={AddRoutine} options={{ headerShown: false }} />
            <Stack.Screen name="Routine" component={Routine} options={{ headerShown: false }} />
            <Stack.Screen name="EditRoutine" component={EditRoutine} options={{ headerShown: false }} />
            <Stack.Screen name="SuggestedRoutine" component={SuggestedRoutine} options={{ headerShown: false }} />
            <Stack.Screen name="EditAccount" component={EditAccount} options={{ headerShown: false }} />
            <Stack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} />
            <Stack.Screen name="LoadingAnalysis" component={LoadingAnalysis} options={{ headerShown: false }} />
            <Stack.Screen name="DiagnosticScreen" component={DiagnosticScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AppLoading" component={AppLoading} options={{ headerShown: false }} />
            <Stack.Screen name="AboutUs" component={AboutUs} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </AuthProvider>
    </DataProvider>
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
const originalError = console.error;

console.warn = (...args) => {
  const [firstArg] = args;
  if (typeof firstArg === 'string' && firstArg.startsWith('Non-serializable values') || 
             firstArg.startsWith('Key "cancelled" in the image picker') || 
             firstArg.startsWith('Encountered two children with the same key') || 
             firstArg.startsWith('Sending `onAnimatedValueUpdate` with no listeners registered.')) {
    // Suppress the warning
    return;
  }
  // For other warnings, call the original console.warn()
  originalWarn.apply(console, args);
};

console.error = (...args) => {
  const [firstArg] = args;
  if (typeof firstArg === 'string' && firstArg.startsWith('AxiosError') || 
             firstArg.startsWith('There was a problem sending log messages')) {
    // Suppress the warning
    return;
  }
  // For other warnings, call the original console.warn()
  originalError.apply(console, args);
};

console.error = (...args) => {
  const [firstArg] = args;
  if (typeof firstArg === 'string' && firstArg.startsWith('There was a problem sending log messages')) {
    // Suppress the error
    return;
  }
  // For other errors, call the original console.error()
  originalError.apply(console, args);
};

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48, use "canceled" instead',
  'Encountered two children with the same key',
  'Request failed with status code 429',
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
  "There was a problem sending log messages to your development environment [PrettyFormatPluginError: value.hasOwnProperty is not a function (it is undefined)]",
  "PrettyFormatPluginError: value.hasOwnProperty is not a function (it is undefined)",
]);
