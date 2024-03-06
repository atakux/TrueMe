import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator, Platform, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, getDisplayName } from 'firebase/auth';
import { updateProfile } from 'firebase/auth'; // Import updateProfile from firebase auth

import { loadFonts } from '../../utils/FontLoader'; 
import { useAuth } from '../../utils/AuthContext';
import { uploadBannerImage, fetchBannerImage, uploadProfileImage, fetchProfileImage, updateUsernameInFirestore } from '../../utils/FirestoreDataService'; // Import fetchLatestBannerImage function
import * as ImagePicker from 'expo-image-picker';

const EditAccount = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const user = useAuth();
  const [errors, setErrors] = useState([]);

  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const [editingDisplayName, setEditingDisplayName] = useState(false); // State to control display name editing
  const [newDisplayName, setNewDisplayName] = useState(''); // State to store new display name

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

  const handleDisplayNameChange = async () => {
    try {
      setLoading(true);
    
      if (newDisplayName === '') {
        setNewDisplayName(user.displayName);
      } 

      await updateProfile(user, { displayName: newDisplayName ? newDisplayName : user.displayName }); // Update display name in Firebase auth
      console.log('DEBUG: Display name updated successfully');
      await updateUsernameInFirestore(user.uid, newDisplayName); // Update username in Firestore
      setEditingDisplayName(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error('DEBUG: Error updating display name:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!fontLoaded || !user) {
    // Font is still loading or user not logged in, you can return a loading indicator or null
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.closeButtonContainer}>
            <Text style={styles.mainText}>Edit Account</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Image source={require('../../../assets/icons/close.png')} style={styles.closeButtonImage} />
            </TouchableOpacity>

            {/* Error Message */}
            {errors.map((error, index) => (
                      <Text key={index} style={styles.errorMessage}>
                          {" ▸ " + error}
                      </Text>
              ))}
        </View>

        <View style={styles.imagesContainer}>
            {loading ? (
                <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator} />
            ) : bannerImage ? (
                <View style={styles.imageContainerBanner}>
                    <Image source={{ uri: bannerImage }} style={styles.imageBanner} />
                    <TouchableOpacity style={styles.selectBannerImageTinyIconButton} onPress={pickBannerImage}>
                        <Image source={require('../../../assets/icons/selectTiny.png')} style={styles.selectBannerIconTiny} />
                    </TouchableOpacity>
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
        
        <View>
            <View style={styles.usernameContainer}>
                {editingDisplayName ? (
                    <View>
                        <Text style={styles.labelText}>New Username: </Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder={user.displayName}
                            onChangeText={setNewDisplayName}
                            value={newDisplayName}
                            autoCapitalize='none' 
                        />
                    </View>
                ) : (
                    <View>
                        <Text style={styles.labelText}>Current Username: </Text>
                        <Text style={styles.inputText} onPress={() => setEditingDisplayName(true)}>{user.displayName}</Text>
                    </View>
                )}
            </View>
        </View>

        <View style={styles.bottomPanel}>
            {loading ? (
                <ActivityIndicator size="large" color="#64BBA1" />
            ) : (
                <TouchableOpacity style={styles.saveButton} onPress={handleDisplayNameChange}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            )}
        </View>
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

  bottomPanel: {
    bottom: -200,
    width: "110%",
    backgroundColor: "#FFFFFF",
    
    // Border
    borderRadius: 75,
    borderWidth: 2,
    borderBottomColor: "rgba(0, 0, 0, 0)",
    borderLeftColor: "rgba(0, 0, 0, 0)",
    borderRightColor: "rgba(0, 0, 0, 0)",
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    
    // Alignment
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
  }, // End of bottomPanel   

  closeButtonContainer: {
    width: "100%",
    marginTop: 20,
  },

  closeButton: {
    position: 'absolute', 
    top: 10,
    right: 10,
    marginRight: 10,
    zIndex: 999,
}, // End of closeButton

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
  },

  errorMessage: {
    fontSize: 14,
    fontFamily: "Sofia-Sans",
    color: "red",
    textAlign: "center",
    alignSelf: "flex-start",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
  }, // End of errorMessage

  mainText: {
    fontSize: 28,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "left",
    padding: 10
  }, // End of mainText

  labelText: {
    fontSize: 24,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "left",
    paddingTop: 10,
    paddingLeft: 10
  },

  inputText: {
    fontSize: 20,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "left",
    paddingLeft: 20
  }, // End of usernameText

  loadingIndicator: {
    marginTop: 100,
    alignSelf: "center",
  }, // End of loadingIndicator

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
        bottom: 2,
        
      },
    }),
  }, // End of selectProfileIcon

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  }, // End of profileImage

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

  saveButton: {
    width: "85%",
    height: 60,
    backgroundColor: "#D0F2DA",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 2,
    marginBottom: 15,
  }, // End of saveButton

  saveButtonText: {
    fontSize: 28,
    fontFamily: "Sofia-Sans",
    color: "#64BBA1",
    textAlign: "center",
  }, // End of saveButtonText

  editIcon: {
    alignSelf: 'center',
    marginTop: 20,
  }, // End of editIcon

}); // End of Stylesheet

export default EditAccount;
