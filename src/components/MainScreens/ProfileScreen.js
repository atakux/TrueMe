import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import { signOut } from 'firebase/auth';

import { FIREBASE_AUTH } from "../../../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadFonts } from '../../utils/FontLoader'; 
import { useAuth } from '../../utils/AuthContext';

import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { fetchBannerImage, fetchProfileImage, uploadProfileImage, uploadBannerImage, getSkinAnalysisResults } from '../../utils/FirestoreDataService';

const ProfileScreen = () => {
  const auth = FIREBASE_AUTH;
  const user = useAuth();
  const navigation = useNavigation();

  const isFocused = useIsFocused(); 
  const [fontLoaded, setFontLoaded] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  
  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [skinAnalysisData, setSkinAnalysisData] = useState(null); 

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); // Set loading to true while fetching image
      // Fetch the latest banner image URL for the user
      const bannerImageUrl = await fetchBannerImage(user.uid);
      if (bannerImageUrl) {
        setBannerImage(bannerImageUrl);
      }
      // Fetch the latest profile image URL for the user
      const profileImageUrl = await fetchProfileImage(user.uid);
      if (profileImageUrl) {
        setProfileImage(profileImageUrl);
      }

      // Fetch skin analysis data
      const analysisData = await getSkinAnalysisResults(user.uid);
      if (analysisData && analysisData.length > 0) {
        setSkinAnalysisData(analysisData);
      }
    } catch (error) {
      console.error('Error fetching images: ', error);
    } finally {
      setLoading(false); // Set loading back to false after fetch completes
    }
  }, [user]);

  useEffect(() => {
    const loadAsyncData = async () => {
      await loadFonts();
      setFontLoaded(true);
    };
    loadAsyncData();
    if (user) {
      fetchData(); // Fetch data when user is available
    }
  }, [user, fetchData]); // Include isFocused in dependency array

  if (!fontLoaded || !user) {
    // Font is still loading or user not logged in, you can return a loading indicator or null
    return null;
  };

  const handleLogout = async () => {
    // Handle logout logic 
    try {
      setLoading(true);
      await signOut(
        auth,
        user
      );

      await AsyncStorage.removeItem('user');
      console.log("DEBUG:", user.displayName, 'signed out');

      navigation.navigate('LaunchScreenLoggedOut')
    } catch (error) {
      setLoading(false);
      console.error('Error signing out: ', error);
    } finally {
      setLoading(false);
    }
  };

  const pickBannerImage = async () => {
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [10, 10],
        quality: 1,
        canceled: false
      });
    
      console.log(result);
    
      if (!result.canceled) {
        setLoading(true); // Set loading to true while uploading image
        setBannerImage(result.assets[0].uri);
        // Call uploadBannerImage function to save the image to Firestore
        try {
          await uploadBannerImage(user.uid, result.assets[0].uri);
        } catch (error) {
          console.error('Error uploading image: ', error);
        } finally {
          setLoading(false); // Set loading back to false after upload completes
        }
      }
    }
    };

  const pickProfileImage = async () => {
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [10, 10],
        quality: 1,
        canceled: false
      });
    
      console.log(result);
    
      if (!result.canceled) {
        setLoading(true); // Set loading to true while uploading image
        setProfileImage(result.assets[0].uri);
        // Call uploadBannerImage function to save the image to Firestore
        try {
          await uploadProfileImage(user.uid, result.assets[0].uri);
        } catch (error) {
          console.error('Error uploading image: ', error);
        } finally {
          setLoading(false); // Set loading back to false after upload completes
        }
      }
    }
  };

  // Function to handle navigation based on skin analysis data
  const handleNavigation = () => {
    if (skinAnalysisData && skinAnalysisData.length > 0) {
      navigation.navigate('ResultScreen');
    } else {
      navigation.navigate('GetStarted');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imagesContainer}>
        {loading ? ( // Conditionally rendering loading indicator
          <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator} />
        ) : bannerImage ? (
          <View style={styles.imageContainerBanner}>
            <Image source={{ uri: bannerImage }} style={styles.imageBanner} />
            <View>
              {loading ? (
                <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator} />
              ) : profileImage ? (
                <View style={styles.profileImageContainer}>
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                </View>
              ) : (
                <TouchableOpacity onPress={pickProfileImage}>
                  <View style={styles.profileImageContainer}>
                    <Image source={require('../../../assets/icons/add-photo.png')} style={styles.selectProfileIcon}/>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.selectBannerImageContainer}>
            <TouchableOpacity onPress={pickBannerImage}>
              <Image source={require('../../../assets/icons/select.png')} style={styles.selectBannerIcon} />
              <Text style={styles.imageButtonText}>Select Banner Image</Text>
            </TouchableOpacity>
            {loading ? (
              <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator} />
            ) : profileImage ? (
              <TouchableOpacity onPress={pickProfileImage}>
                <View style={styles.profileImageContainerSelect}>
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pickProfileImage}>
                <View style={styles.profileImageContainerSelect}>
                  <Image source={require('../../../assets/icons/add-photo.png')} style={styles.selectProfileIcon}/>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
      <View>
        <Text style={styles.mainText}>{user.displayName}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View styles={styles.buttonsContainer}>
        
          {/* Edit Account and Log Out buttons */}
          <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 10}}>
            <TouchableOpacity onPress={() => handleLogout()} style={styles.buttons}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('EditAccount')} style={styles.buttons}>
              <Text style={styles.buttonText}>Edit Account</Text>
            </TouchableOpacity>
          </View>

          {/* Skin Diagnostic Test and Results buttons */}
          <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 20}}>
            <TouchableOpacity onPress={() => navigation.navigate('GetStarted')} style={styles.buttons}>
              <Text style={styles.buttonText}>Skin Diagnostic Test</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNavigation} style={styles.buttons}>
              <Text style={styles.buttonText}>Skin Diagnostic Results</Text>
            </TouchableOpacity>
          </View>
        
          {/* About us buttos */}
          <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, marginBottom: 30}}>
            <TouchableOpacity onPress={() => console.log('DEBUG: about us clicked')} style={styles.buttons}>
              <Text style={styles.buttonText}>About Us</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: "#FAFAFA",
    width: "100%",
  }, // End of container

  scrollView: {
    flex: 1,
    marginBottom: 20,
    flexGrow: 1,
    
    ...Platform.select({
      ios: {
        useViewOverflow: true,
        marginBottom: 70
      },
      android: {
        useViewOverflow: false,
        marginBottom: 100
      }
    })
  }, // End of scrollView

  buttonsContainer: {
    flex: 1,
    flexGrow: 2,
    width: "100%",
    marginBottom: 600,
  }, // End of buttonsContainer

  imagesContainer: {
    width: "100%",

    ...Platform.select({
      ios: {
        height: 290,
      },
      android: {
        height: 325,
      },
    }),
  }, // End of imagesContainer

  mainText: {
    fontSize: 24,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "center",
    letterSpacing: 3.5,
    marginBottom: 5,

    ...Platform.select({
      ios: {
        marginTop: 10,
      },

      android: {
        marginTop: 10,
      }

    }),
    
  }, // End of mainText

  loadingIndicator: {
    marginTop: 100,
    alignSelf: "center",
  }, // End of loadingIndicator

  // Profile Picture
  profileImageContainerSelect: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: '#7FB876',
    borderWidth: 1,
    backgroundColor: '#EBF5F5',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: "center",

    ...Platform.select({
      ios: {
        top: -5,
      },
      android: {
        top: -5,
      },
    }),
  }, // End of profileImageContainerSelect

  profileImageContainer: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: '#7FB876',
    borderWidth: 1,
    backgroundColor: '#EBF5F5',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: "center",

    ...Platform.select({
      ios: {
        top: -80,
      },
      android: {
        top: -80,
      },
    }),
  }, // End of profileImageContainer

  selectProfileIcon: {
    width: 64,
    height: 64,
    alignSelf: "center",
  }, // End of selectProfileIcon

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  }, // End of profileImage

  // Banner
  selectBannerImageContainer: {
    width: "100%",
    backgroundColor: '#EBF5F5',
    borderWidth: 1,
    borderColor: '#7FB876',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center",
    ...Platform.select({
      ios: {
        height: 200,
      },
      android: {
        marginTop: 40,
        height: 200,
      },
    }),
  }, // End of selectBannerImageContainer

  selectBannerIcon: {
    width: 64,
    height: 64,
    alignSelf: "center",
  }, // End of selectBannerIcon

  imageContainerBanner: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,

    ...Platform.select({
      ios: {
        height: 200,
      },
      android: {
        height: 200,
      },
    }),
  }, // End of imageContainerBanner

  imageBanner: {
    width: "100%",
    resizeMode: 'cover',
    marginBottom: 10,

    ...Platform.select({
      ios: {
        height: 200,
      },
      android: {
        marginTop: 40,
        height: 200,
      },
    }),
  }, // End of imageBanner

  buttons: {
    width: 160,
    height: 114,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,

    ...Platform.select({
      ios: {
        elevation: 5,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.25,
      },

      android: {
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { 
          width: 0, 
          height: 3, 
        },
        shadowOpacity: 0.25,
      }

    }),
  }, // End of buttons

  buttonText: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontFamily: 'Sofia-Sans',
    fontSize: 20,
    color: '#000000',

  }, // End of buttonText

  imageButtonText: {
    fontSize: 16,
    fontFamily: 'Sofia-Sans',
    color: '#64BBA1',
    textAlign: "center",
    marginBottom: 15,
  }, // End of buttonText
});

export default ProfileScreen;
