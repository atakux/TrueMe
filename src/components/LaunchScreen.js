// Launch Screen

import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Button, TouchableOpacity, Image } from 'react-native';


import { useNavigation } from '@react-navigation/native';

import * as Font from 'expo-font';

// Load fonts
const LoadFonts = async () => {
  await Font.loadAsync({
    'Spirax-Regular': require('../../assets/fonts/Spirax-Regular.ttf'),
    'Sofia-Sans': require('../../assets/fonts/Sofia-Sans.ttf'),
  });
};

const LaunchScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadAsyncData = async () => {
      await LoadFonts();
      setFontLoaded(true);
    };

    loadAsyncData();
  }, []);

  if (!fontLoaded) {
    // Font is still loading, you can return a loading indicator or null
    return null;
  }

  return (
    // Actual Launch Screen
    <SafeAreaView style={styles.container}>

        {/* Top flowers */}
        <Image source={require('../../assets/images/top_flowers.png')} style={styles.topFlowers} />

        {/* Title and Affirmation Text */}
        <View style={{alignItems: 'center', marginTop: 50 }}>
            {/* Title */}
            <Text style={styles.trueMeTitle}>
                {"TrueMe"}
            </Text> 

            {/* Daily Affirmation Text 
            TODO: Get Daily Affirmation from API */}
            <Text style={styles.mainText}>
                {"Insert Daily Affirmation Here!"}
            </Text>

        </View>

        {/* Login and Sign up buttons */}
        <View style={{alignItems: 'center', marginTop: 50}}>
            
            <TouchableOpacity
                style={styles.buttons}
                onPress={() => {
                    // Navigate to LoginScreen
                    navigation.navigate('LoginScreen');
                }}
                >
                <Text style={styles.buttonText}>
                    {"Login"}
                </Text>
            </TouchableOpacity>

            {/* Spacer */}
            <View style={{ height: 50 }} /> 


            {/* Sign Up button will take you to sign up screen. */}
            <TouchableOpacity
                style={styles.buttons}
                onPress={() => {
                    // Navigate to SignupScreen
                    navigation.navigate('SignupScreen');
                }}
                >
                <Text style={styles.buttonText}>
                    {"Sign Up"}
                </Text>
            </TouchableOpacity>

        </View>

        {/* Bottom flowers */}
        <Image source={require('../../assets/images/bottom_flowers.png')} style={{marginTop: 60, marginBottom: 50, width: 285, height: 178}} />
      
    </SafeAreaView>
  );
};

// Styles

const styles = StyleSheet.create({
  topFlowers: {
    ...Platform.select({
        ios: {
            marginLeft: 150, 
            width: 245, 
            height: 138,
            marginTop: -52,
        },

        android: {
            marginLeft: 120, 
            width: 245, 
            height: 138,
        }
    })    
  },

  container: {
    flex: 5,
    backgroundColor: "#D4CCDD",
    width: "100%",
  }, // End of container

  trueMeTitle: {
    fontSize: 64,
    fontFamily: 'Spirax-Regular',
    color: '#804295',
    textAlign: "center",
    marginBottom: 30,
    marginTop: 15,
  }, // End of trueMeTitle

  mainText: {
    fontSize: 24,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "center",
  }, // End of mainText

  buttons: {
    width: 159,
    height: 82,
    backgroundColor: '#D0F2DA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#7FB876',
    justifyContent: 'center',
    alignItems: 'center',
  }, // End of buttons

  buttonText: {
    fontSize: 32,
    fontFamily: 'Sofia-Sans',
    color: '#64BBA1',
    textAlign: "center",
  }, // End of buttonText

});

export default LaunchScreen;
