import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, getDisplayName } from 'firebase/auth';

import { loadFonts } from '../../utils/FontLoader'; 
import { useAuth } from '../../utils/AuthContext';
import { uploadBannerImage, fetchBannerImage, uploadProfileImage, fetchProfileImage } from '../../utils/FirestoreDataService'; // Import fetchLatestBannerImage function
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const user = useAuth();
  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    const loadAsyncData = async () => {
      await loadFonts();
      setFontLoaded(true);
    };

    loadAsyncData();
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true); // Set loading to true while fetching image
        // Fetch the latest banner image URL for the user
        const bannerImageUrl = await fetchBannerImage(user.uid);
        if (bannerImageUrl) {
          setBannerImage(bannerImageUrl);
        }
      } catch (error) {
        console.error('Error fetching banner image: ', error);
      } finally {
        setLoading(false); // Set loading back to false after fetch completes
      }
    };

    const fetchProfile = async () => {
      try {
        setLoading(true); // Set loading to true while fetching image
        // Fetch the latest profile image URL for the user
        const profileImageUrl = await fetchProfileImage(user.uid);
        if (profileImageUrl) {
          setProfileImage(profileImageUrl);
        }
      } catch (error) {
        console.error('Error fetching profile image: ', error);
      } finally {
        setLoading(false); // Set loading back to false after fetch completes
      }
    };

    if (user) {
      fetchBanner(); // Fetch the banner image when user is available
      fetchProfile(); // Fetch the profile image when user is available
    }
  }, [user]);

  if (!fontLoaded || !user) {
    // Font is still loading or user not logged in, you can return a loading indicator or null
    return null;
  };

  const pickBannerImage = async () => {
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
  };

  const pickProfileImage = async () => {
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {loading ? ( // Conditionally rendering loading indicator
          <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator} />
        ) : bannerImage ? (
          <View style={styles.imageContainerBanner}>
            <Image source={{ uri: bannerImage }} style={styles.imageBanner} />
            <TouchableOpacity style={styles.selectBannerImageTinyIconButton} onPress={pickBannerImage}>
              <Image source={require('../../../assets/icons/selectTiny.png')} style={styles.selectBannerIconTiny} />
            </TouchableOpacity>
            {/* Circle */}
            <View>
               {loading ? (
                 <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator} />
               ) : profileImage ? (
                 <View style={styles.profileImageContainer}>
                   <Image source={{ uri: profileImage }} style={styles.profileImage} />
                   <TouchableOpacity style={styles.selectProfileImageTinyIconButton} onPress={pickProfileImage}>
                     <Image source={require('../../../assets/icons/add-photoTiny.png')} style={styles.selectProfileIconTiny} />
                   </TouchableOpacity>
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
              <Text style={styles.buttonText}>Select Banner Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Your other components and UI elements go here */}
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

  mainText: {
    fontSize: 24,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "center",
  }, // End of mainText

  loadingIndicator: {
    marginTop: 100,
    alignSelf: "center",
  }, // End of loadingIndicator

  // Profile Picture
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

  selectProfileIconTiny: {
    width: 24,
    height: 24,
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
  }, // End of selectProfileIcon

  selectProfileImageTinyIconButton : {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#EBF5F5',
    borderWidth: 1,
    borderColor: '#7FB876',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,

    ...Platform.select({
      ios: {
        bottom: 2,
      },

      android: {
        bottom: -65,
        right: 5,
      },
    }),
  }, // End of selectProfileIcon

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  }, // End of profileImage

  // Banner
  selectBannerImageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: '#EBF5F5',
    borderWidth: 1,
    borderColor: '#7FB876',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center",
  }, // End of selectBannerImageContainer

  selectBannerIconTiny: {
    width: 32,
    height: 32,
    alignSelf: "center",
  }, // End of selectBannerIcon

  selectBannerIcon: {
    width: 64,
    height: 64,
    alignSelf: "center",
  }, // End of selectBannerIcon

  selectBannerImageTinyIconButton: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#EBF5F5',
    borderWidth: 1,
    borderColor: '#7FB876',
    paddingLeft: 12,
    paddingTop: 10,
    paddingBottom: 9,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',

    ...Platform.select({
      ios: {
        bottom: -20,
        right: 5,
      },

      android: {
        bottom: -65,
        right: 5,
      },
    }),
  }, // End of selectBannerImageTinyIconButton

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
    fontSize: 16,
    fontFamily: 'Sofia-Sans',
    color: '#64BBA1',
    textAlign: "center",
  }, // End of buttonText
});

export default ProfileScreen;
