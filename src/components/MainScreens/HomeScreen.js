import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, getDisplayName } from 'firebase/auth';

import Carousel from 'react-native-snap-carousel';

import { loadFonts } from '../../utils/FontLoader'; 
import { useAuth } from '../../utils/AuthContext';

const HomeScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const user = useAuth();

  useEffect(() => {
    const loadAsyncData = async () => {
      await loadFonts();
      setFontLoaded(true);
    };

    loadAsyncData();
  }, []);

  if (!fontLoaded || !user) {
    // Font is still loading or user not logged in, you can return a loading indicator or null
    return null;
  }

  const handleCameraClick = () => {
    console.log("DEBUG: Camera clicked");
  }

  // Define list of daily routines
  const dailyRoutines = [
    { id: 1, title: 'Daily Routine' },
    { id: 2, title: 'Add Routine' },
  ];

  // Render item for carousel
  const renderRoutineItem = ({ item }) => {
    return (
      <View style={styles.dailyRoutinesContainer}>
        <Text style={styles.mainText}>{item.title}</Text>
      </View>
    );
  };  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
          {/* Top Container */}
          <View style={styles.topContainer}>
            <Text style={styles.topContainerText}>Hello {user.displayName}!</Text>
          <Image source={require('../../../assets/images/home_top_image.png')} style={{alignSelf: "center"}}/>
          </View>

          {/* Skin Diagnostic Container */}
          <View style={styles.skinResultContainer}>
            {/* Container Title */}
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>Skin Diagnostic Results</Text>
              <Text style={styles.textStyle}>Start your journey to healthy skin here!</Text>
            </View>
            
            {/* Camera Button */}
            <TouchableOpacity onPress={handleCameraClick}>
              <Image source={require('../../../assets/icons/large_camera.png')} style={styles.cameraButton}/>
              <Text style={styles.cameraButtonText}>Click to scan your face</Text>
            </TouchableOpacity>
          </View>

          {/* Daily Routines Container */}
          <Carousel
            // data and rendering
            data={dailyRoutines}
            renderItem={renderRoutineItem}

            sliderWidth={Platform.OS === 'ios' ? 300 : 300}
            sliderHeight={Platform.OS === 'ios' ? 100 : 30} // Add sliderHeight for vertical carousel
            
            itemWidth={Platform.OS === 'ios' ? 300 : 330}
            itemHeight={Platform.OS === 'ios' ? 150 : 90} // Add itemHeight for vertical carousel
          
            inactiveSlideOpacity={0}
            inactiveSlideScale={0}

            layout="stack"
            layoutCardOffset={Platform.OS === 'ios' ? 3 : 0}
            
            vertical={true}
            loop={true}
            windowSize={1}

            />
          

      </ScrollView>
    </SafeAreaView>
  );
};

// Styles

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FAFAFA",
      width: "100%",
      flexGrow: 1
    }, // End of container

    scrollView: {
      flex: 1,
    },

    topContainer: {
      ...Platform.select({
        ios: {
          backgroundColor: "#D0F2DA",
          width: 348,
          height: 219,
          borderRadius: 35,
          shadowColor: "black",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.25,
          elevation: 5,
          alignSelf: "center",
          padding: 20,
        },

        android: {
          backgroundColor: "#D0F2DA",
          width: 330,
          height: 219,
          borderRadius: 35,

          elevation: 5,
          marginTop: 40,
          alignSelf: "center",
          padding: 20,

          shadowColor: 'black',
          shadowOffset: { width: 0, height: 3, },
          shadowOpacity: 0.25,
        }

      })

    }, // End of topContainer

    topContainerText: {
      fontSize: 32,
      fontFamily: 'Sofia-Sans',
      color: '#64BBA1',
      textAlign: "center",
      marginBottom: 7,
    }, // End of topContainerText

    skinResultContainer: {
      ...Platform.select({
        ios: {
          backgroundColor: "#FFFFFF",
          width: 348,
          height: 320,
          borderRadius: 35,
          shadowColor: "black",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.25,
          elevation: 5,
          alignSelf: "center",
          padding: 20,

          marginTop: 30,
          marginBottom: 10
        },

        android: {
          backgroundColor: "#FFFFFF",
          width: 330,
          height: 300,
          borderRadius: 35,

          elevation: 5,
          marginTop: 30,
          marginBottom: 10,
          alignSelf: "center",
          padding: 20,

          shadowColor: 'black',
          shadowOffset: { width: 0, height: 3, },
          shadowOpacity: 0.25,
        }
      })
    }, // End of skinResultContainer

    dailyRoutinesContainer: {
      ...Platform.select({
        ios: {
          backgroundColor: "#FFFFFF",
          width: 348,
          height: 100,
          borderRadius: 35,
          shadowColor: "black",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.25,
          elevation: 5,
          alignSelf: "center",
          padding: 20,

          marginTop: 10
        },

        android: {
          backgroundColor: "#FFFFFF",
          width: 330,
          height: 100,
          borderRadius: 35,

          elevation: 5,
          marginTop: 10,
          alignSelf: "center",
          padding: 20,

          shadowColor: 'black',
          shadowOffset: { width: 0, height: 3, },
          shadowOpacity: 0.25,

        }

      })

    }, // End of dailyRoutinesContainer

    textContainer: {
      marginBottom: 30
    },
  
    mainText: {
      fontSize: 24,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "left",
      marginBottom: 10
    }, // End of mainText

    textStyle: {
      fontSize: 16,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "center",
    }, // End of textStyle
  
    buttons: {
      width: 159,
      height: 82,
      backgroundColor: '#D0F2DA',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#7FB876',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: "center",
    }, // End of buttons

    cameraButton: {
      overflow: 'hidden',
      borderColor: '#64BBA1',
      borderWidth: 2,
      borderRadius: 100,
      alignSelf: "center",
    }, // End of cameraButton
  
    buttonText: {
      fontSize: 32,
      fontFamily: 'Sofia-Sans',
      color: '#64BBA1',
      textAlign: "center",
    }, // End of buttonText

    cameraButtonText: {
      fontSize: 16,
      fontFamily: 'Sofia-Sans',
      color: '#64BBA1',
      textAlign: "center",
      marginTop: 10
    }, // End of cameraButtonText

    dailyRoutineItem: {
      backgroundColor: '#FFFFFF',
      borderRadius: 35,
      padding: 20,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      elevation: 5,
    },
  
    dailyRoutineText: {
      fontSize: 18,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: 'center',
    },
  
  });

export default HomeScreen;

