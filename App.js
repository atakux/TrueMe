import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './src/utils/AuthContext';

import LaunchScreen from './src/components/LaunchScreen';
import LoginScreen from './src/authentication/LoginScreen';
import SignupScreen from './src/authentication/SignupScreen';
import HomeScreen from './src/components/HomeScreen'; 
import ShopScreen from './src/components/ShopScreen'; 
import DiscoverScreen from './src/components/DiscoverScreen';
import ProfileScreen from './src/components/ProfileScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// TODO: figure out how to store user login info to store previous session

// TabBar
function TabBar() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
      <Tab.Screen name="Shop" component={ShopScreen} options={{headerShown: false}} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{headerShown: false}} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
    </Tab.Navigator>
  );
}

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
