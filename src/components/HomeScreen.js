import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Button, TouchableOpacity, Image } from 'react-native';


import { useNavigation } from '@react-navigation/native';

import * as Font from 'expo-font';

import { loadFonts } from '../utils/FontLoader'; 


const HomeScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadAsyncData = async () => {
      await loadFonts();
      setFontLoaded(true);
    };

    loadAsyncData();
  }, []);

  if (!fontLoaded) {
    // Font is still loading, you can return a loading indicator or null
    return null;
  }

  return (
    // Actual Home Screen
    <SafeAreaView style={styles.container}>

        

    </SafeAreaView>


  );
};

// Styles

const styles = StyleSheet.create({
    container: {
      flex: 5,
      backgroundColor: "#D4CCDD",
      width: "100%",
    }, // End of container
  
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

export default HomeScreen;

