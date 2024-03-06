import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, getDisplayName } from 'firebase/auth';

import { loadFonts } from '../../utils/FontLoader'; 
import { useAuth } from '../../utils/AuthContext';
import { uploadImage, fetchBannerImage } from '../../utils/FirestoreDataService'; // Import fetchLatestBannerImage function
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const user = useAuth();
  const [image, setImage] = useState(null);
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
          setImage(bannerImageUrl);
        }
      } catch (error) {
        console.error('Error fetching banner image: ', error);
      } finally {
        setLoading(false); // Set loading back to false after fetch completes
      }
    };

    if (user) {
      fetchBanner(); // Fetch the banner image when user is available
    }
  }, [user]);

  if (!fontLoaded || !user) {
    // Font is still loading or user not logged in, you can return a loading indicator or null
    return null;
  };

  const pickImage = async () => {
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
      setImage(result.assets[0].uri);
      // Call uploadImage function to save the image to Firestore
      try {
        await uploadImage(user.uid, result.assets[0].uri);
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
        ) : image ? (
          <View style={styles.imageContainerBanner}>
            <Image source={{ uri: image }} style={styles.imageBanner} />
            <TouchableOpacity style={styles.selectBannerImageTinyIconButton} onPress={pickImage}>
              <Image source={require('../../../assets/icons/selectTiny.png')} style={styles.selectBannerIconTiny} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.selectBannerImageContainer}>
            <TouchableOpacity onPress={pickImage}>
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

  selectBannerImageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: '#EBF5F5',
    borderWidth: 1,
    borderColor: '#7FB876',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center",
  },

  selectBannerIconTiny: {
    width: 32,
    height: 32,
    alignSelf: "center",
  },

  selectBannerIcon: {
    width: 64,
    height: 64,
    alignSelf: "center",
  },

  selectBannerImageTinyIconButton: {
    position: 'absolute',
    bottom: -20,
    right: 5,
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
  },

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
  },

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
  }, // End of buttons

  buttonText: {
    fontSize: 16,
    fontFamily: 'Sofia-Sans',
    color: '#64BBA1',
    textAlign: "center",
  }, // End of buttonText

});

export default ProfileScreen;
