import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { loadFonts } from '../utils/FontLoader'; // If needed

// Importing JSON data
import affirmations from '../utils/json/affirmations.json'; // Adjust the file path as needed

const LaunchScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadAsyncData = async () => {
      await loadFonts(); // If needed
      setFontLoaded(true);
      // Select a random affirmation
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      setAffirmation(affirmations[randomIndex]);
    };

    loadAsyncData();
  }, []);

  if (!fontLoaded) {
    // Font is still loading, you can return a loading indicator or null
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/images/top_flowers.png')} style={styles.topFlowers} />
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Text style={styles.trueMeTitle}>{"TrueMe"}</Text>
        <Text style={styles.mainText}>{affirmation}</Text>
      </View>
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            // Navigate to LoginScreen
            navigation.navigate('LoginScreen');
          }}>
          <Text style={styles.buttonText}>{"Login"}</Text>
        </TouchableOpacity>
        <View style={{ height: 50 }} />
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            // Navigate to SignupScreen
            navigation.navigate('SignupScreen');
          }}>
          <Text style={styles.buttonText}>{"Sign Up"}</Text>
        </TouchableOpacity>
      </View>
      <Image source={require('../../assets/images/bottom_flowers.png')} style={{ marginTop: 60, marginBottom: 50, width: 285, height: 178 }} />
    </SafeAreaView>
  );
};

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
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: "#D4CCDD",
    width: "100%",
  },
  trueMeTitle: {
    fontSize: 64,
    fontFamily: 'Spirax-Regular',
    color: '#804295',
    textAlign: "center",
    marginBottom: 30,
    marginTop: 15,
  },
  mainText: {
    fontSize: 24,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "center",
    width: '90%',
  },
  buttons: {
    width: 159,
    height: 82,
    backgroundColor: '#D0F2DA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#7FB876',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 32,
    fontFamily: 'Sofia-Sans',
    color: '#64BBA1',
    textAlign: "center",
  },
});

export default LaunchScreen;
