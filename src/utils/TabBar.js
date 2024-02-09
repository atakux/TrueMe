import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';

import HomeScreen from '../components/HomeScreen'; 
import ShopScreen from '../components/ShopScreen'; 
import DiscoverScreen from '../components/DiscoverScreen';
import ProfileScreen from '../components/ProfileScreen';

const Tab = createBottomTabNavigator();

// TabBar
function TabBar() {
    return (
      <Tab.Navigator
        screenOptions= {({ route }) => ({
            tabBarIcon: ({ focused }) => {
                // Icon filled vs outlined depending on route
                if (route.name === 'Home') {
                    iconSource = focused ? require('../../assets/icons/home-fill.png') : require('../../assets/icons/home.png');
                } else if (route.name === 'Shop') {
                    iconSource = focused ? require('../../assets/icons/shopping-cart-fill.png') : require('../../assets/icons/shopping-cart.png');
                } else if (route.name === 'Discover') {
                    iconSource = focused ? require('../../assets/icons/sparkles-fill.png') : require('../../assets/icons/sparkles.png');
                } else if (route.name === 'Profile') {
                    iconSource = focused ? require('../../assets/icons/user-fill.png') : require('../../assets/icons/user.png');
                }
                return <Image source={iconSource} />; 
            },

            headerShown: false,
            tabBarStyle: {...styles.tabBar}
        })}

        tabBarOptions={{
            showLabel: false,
        }}  
      >
        {/* Screens that tabs navigate to */}
        <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Tab.Screen name="Shop" component={ShopScreen} options={{headerShown: false}} />
        <Tab.Screen name="Discover" component={DiscoverScreen} options={{headerShown: false}} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
      </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        alignSelf: 'center',

        backgroundColor: 'white',
        borderRadius: 33,
        borderTopWidth: 0,
        elevation: 5,
        padding: 30,
        
        marginHorizontal: 10,
        marginBottom: 40,

        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
    }, // End of tabBar
});


export default TabBar;