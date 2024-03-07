import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Modal, TouchableOpacity, Image, ActivityIndicator, Platform, TextInput, TouchableWithoutFeedback } from 'react-native';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import { onAuthStateChanged, getDisplayName, EmailAuthProvider } from 'firebase/auth';
import { updateProfile, reauthenticateWithCredential, updatePassword } from 'firebase/auth'; // Import reauthenticateWithCredential and updatePassword from firebase auth

import { loadFonts } from '../../utils/FontLoader'; 
import { useAuth } from '../../utils/AuthContext';
import { uploadBannerImage, fetchBannerImage, uploadProfileImage, fetchProfileImage, updateUsernameInFirestore } from '../../utils/FirestoreDataService'; // Import fetchLatestBannerImage function
import * as ImagePicker from 'expo-image-picker';

const EditAccount = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const user = useAuth();
  const isFocused = useIsFocused(); 

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state

  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');

  const [editingEmail, setEditingEmail] = useState(false); 
  const [newEmail, setNewEmail] = useState(''); 
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isEditPasswordModalVisible, setIsEditPasswordModalVisible] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [PWLoading, setPWLoading] = useState(false);

  // Function to toggle modal visibility
  const toggleEditPasswordModal = () => {
    setIsEditPasswordModalVisible(!isEditPasswordModalVisible);
    setPasswordErrors([]);
  };

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
  }, [user, fetchData, isFocused]);

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

  const handleSaveChanges = async () => {

    try {
      setLoading(true);

      handleDisplayNameChange();
      handleEmailChange();

      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false);
    }
      
  };

  const handleUpdatePassword = async () => {
    try {
      setPasswordErrors([]);
      setPWLoading(true);

      if (newPassword === '' && confirmPassword === '' && currentPassword === '') {
        setPasswordErrors(['Please enter new password or cancel']);
        setLoading(false);
        return;
      } else if (newPassword !== confirmPassword) {
        setPasswordErrors(['New password & confirm password must match']);
        setLoading(false);
        return;
      } else if (newPassword.length < 6) {
        setPasswordErrors(['Password must be at least 6 characters']);
        setLoading(false);
        return;
      }
      else {
        // Re-authenticate user before changing password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Check if new password matches confirmation
        if (newPassword !== confirmPassword) {
          setErrors(['New password and confirm password must match']);
          setLoading(false);
          return;
        }

        // Update password in Firebase auth
        await updatePassword(user, newPassword);
        console.log('Password updated successfully');

        setIsEditPasswordModalVisible(false);
        
        // Reset states and navigate back
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setPasswordErrors(['Current password is incorrect']);
        setPWLoading(false);
        return;
      }
      console.error('Error updating password:', error);
      setErrors([error.message]); // You can handle error messages
    } finally {
      setPWLoading(false);
    }
  };

  const handleDisplayNameChange = async () => {
    try {
      setLoading(true);
    
      if (newDisplayName === '') {
        return;
      } else {
        await updateProfile(user, { displayName: newDisplayName ? newDisplayName : user.displayName }); // Update display name in Firebase auth
        console.log('DEBUG: Display name updated successfully');
        await updateUsernameInFirestore(user.uid, newDisplayName); // Update username in Firestore
        setEditingDisplayName(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('DEBUG: Error updating display name:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    try {
      setLoading(true);
      if (newEmail === '') {
        return;
      } else {
        // Update email in Firebase auth
        await updateProfile(user, { email: newEmail ? newEmail : user.email });
        console.log('DEBUG: Email updated successfully');
        
        // Reset states and navigate back
        setEditingEmail(false);
        setNewEmail('');
      }
    } catch (error) {
      console.error('DEBUG: Error updating email:', error);
      setErrors([...errors, error.message]); // You can handle error messages
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
              <Image source={require('../../../assets/icons/close.png')} style={styles.closeIcon} />
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
            <View>
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
          </View>
          )}
        </View>

        
        <View>
          <View style={styles.inputContainer}>
            {editingDisplayName ? (
              <View>
                <Text style={styles.labelText}>New Username: </Text>
                <View style={{ flexDirection: 'row', marginLeft: 10}}>
                  <Image source={require('../../../assets/icons/edit-text.png')} />
                  <TextInput
                    style={styles.inputText}
                    placeholder={user.displayName}
                    onChangeText={setNewDisplayName}
                    value={newDisplayName}
                    autoCapitalize='none' 
                  />
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.labelText}>Current Username: </Text>
                <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10}} onPress={() => setEditingDisplayName(true)}>
                  <Image source={require('../../../assets/icons/edit-text.png')} />
                  <Text style={styles.previousText}>{user.displayName}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            {editingEmail ? (
              <View>
                <Text style={styles.labelText}>New Email: </Text>
                <View style={{ flexDirection: 'row', marginLeft: 10}}>
                  <Image source={require('../../../assets/icons/edit-text.png')} />
                  <TextInput
                    style={styles.inputText}
                    placeholder={user.email}
                    onChangeText={setNewEmail}
                    value={newEmail}
                    autoCapitalize='none' 
                  />
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.labelText}>Current Email: </Text>
                <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10}} onPress={() => setEditingEmail(true)}>
                  <Image source={require('../../../assets/icons/edit-text.png')} />
                  <Text style={styles.previousText}>{user.email}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.editButton} onPress={toggleEditPasswordModal}>
            <Text style={styles.editButtonText}>Edit Password</Text>
          </TouchableOpacity>            
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditPasswordModalVisible}
          onRequestClose={toggleEditPasswordModal}>
          <TouchableWithoutFeedback onPress={() => setIsEditPasswordModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {PWLoading ? (
                  <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator} />
                ) : (
                  <View>
                    {/* Error Message */}
                    {passwordErrors.map((error, index) => (
                        <Text key={index} style={styles.errorMessage}>
                            {" ▸ " + error}
                        </Text>
                    ))}

                    <Text style={styles.labelText}>Current Password</Text>
                    <TextInput
                      style={styles.pwInputText}
                      placeholder="Enter current password"
                      secureTextEntry={true}
                      onChangeText={setCurrentPassword}
                      value={currentPassword}
                    />
                    <Text style={styles.labelText}>New Password</Text>
                    <TextInput
                      style={styles.pwInputText}
                      placeholder="Enter new password"
                      secureTextEntry={true}
                      onChangeText={setNewPassword}
                      value={newPassword}
                    />
                    <Text style={styles.labelText}>Confirm New Password</Text>
                    <TextInput
                      style={styles.pwInputText}
                      placeholder="Confirm new password"
                      secureTextEntry={true}
                      onChangeText={setConfirmPassword}
                      value={confirmPassword}
                    />

                    <TouchableOpacity style={styles.savePasswordButton} onPress={handleUpdatePassword}>
                      <Text style={styles.savePasswordButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={toggleEditPasswordModal}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View style={styles.bottomPanel}>
            {loading ? (
                <ActivityIndicator size="large" color="#64BBA1" />
            ) : (
                <>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </>
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

  inputContainer: {
    width: "100%",
    marginTop: 10,
    padding: 5,
  }, // End of inputContainer

  bottomPanel: {
    bottom: -100,
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
  }, // End of closeButtonContainer

  closeButton: {
    position: 'absolute', 
    top: 10,
    right: 10,
    marginRight: 10,
    zIndex: 999,

    ...Platform.select({
      ios: {
        marginTop: -25,
        marginBottom: 10,
      },
      android: {
        marginTop: 25,
      }

    })
}, // End of closeButton

  imagesContainer: {
    width: "100%",

    ...Platform.select({
      ios: {
        marginTop: -10,
        height: 290,
      },
      android: {
        marginTop: -30,
        height: 325,
      },
    }),
  }, // End of imagesContainer

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
    padding: 10,

    ...Platform.select({
      ios: {
        marginTop: -27,
        marginBottom: 10,
      },
      android: {
        marginTop: 23,
      }
    })
  }, // End of mainText

  labelText: {
    fontSize: 23,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "left",
    paddingTop: 10,
    paddingLeft: 10
  }, // End of labelText

  inputText: {
    fontSize: 20,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "left",
  }, // End of inputText

  pwInputText: {
    fontSize: 20,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "left",
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#64BBA1",
    padding: 5,
    paddingLeft: 10,
  }, // End of inputText

  previousText: {
    fontSize: 20,
    fontFamily: 'Sofia-Sans',
    color: '#7FB876',
    textAlign: "left",
  }, // End of previousText

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
    top: 10,
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

    ...Platform.select({
      ios: {
        marginTop: 5,
      },

      android: {
        marginTop: 35,
      },
    })
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

  editButton: {
    backgroundColor: '#804396',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  }, // End of editButton

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Sofia-Sans',
    textAlign: 'center',
  }, // End of editButtonText

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }, // End of modalContainer

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  }, // End of modalContent

  modalTitle: {
    fontSize: 20,
    fontFamily: 'Sofia-Sans-Bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  }, // End of modalTitle

  savePasswordButton: {
    backgroundColor: '#804396',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: 'center',
    margin: 15,
    marginBottom: 5,
  }, // End of savePasswordButton

  savePasswordButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Sofia-Sans',
    textAlign: 'center',
  }, // End of savePasswordButton

  cancelButton: {    
    borderRadius: 8,
    paddingVertical: 12,
    alignSelf: 'center',
  }, // End of cancelButton

  cancelButtonText: {
    color: '#804396',
    fontSize: 17,
    fontFamily: 'Sofia-Sans',
    textAlign: 'center',
  }, // End of cancelButton


}); // End of Stylesheet

export default EditAccount;
