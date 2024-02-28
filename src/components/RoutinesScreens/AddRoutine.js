import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebase'; 
import { useAuth } from '../../utils/AuthContext';
import { useRoutineContext } from '../../utils/RoutineContext';
import { loadFonts } from '../../utils/FontLoader';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

const AddRoutine = ({ route }) => {
    const navigation = useNavigation();
    const [routineName, setRoutineName] = useState('');
    const user = useAuth(); 
    const { updateDailyRoutines } = route.params;
    const [errors, setErrors] = useState([]);

    // Load fonts
    useEffect(() => {
      const loadAsyncData = async () => {
        await loadFonts();
      };
      loadAsyncData();
    }, []);

    // Add routine 
    const handleAddRoutine = async () => {
      try {
        setErrors([]);

        if (routineName === '') {
          console.log('DEBUG: Routine title cannot be empty');
          setErrors((prevErrors) => [...prevErrors, 'Please enter a routine name']);
          return;
        }

        // Add routine to user's routines collection in Firestore
        const routinesDocRef = collection(FIRESTORE_DB, 'users', user.uid, 'routines');
        const docRef = await addDoc(routinesDocRef, {
          title: routineName,
        });
        // Call the update function passed from HomeScreen to update dynamically
        updateDailyRoutines({ id: docRef.id, title: routineName });

        console.log('DEBUG: Routine', routineName, 'added successfully');

        // Navigate back to HomeScreen
        navigation.goBack();
      } catch (error) {
        console.error('DEBUG: Error adding routine: ', error);
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Image source={require('../../../assets/icons/close.png')} style={styles.closeButtonImage} />
            </TouchableOpacity>

            <Text style={styles.title}>Add a Routine</Text>

            {/* Error Message */}
            {errors.map((error, index) => (
                    <Text key={index} style={styles.errorMessage}>
                        {" ▸ " + error}
                    </Text>
                ))}
            
            <View style={styles.contentContainer}>
                <Text style={styles.inputLabel}>Name</Text>

                <TextInput
                    style={styles.inputName}
                    placeholder="Daily Routine"
                    value={routineName}
                    onChangeText={setRoutineName}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttons} onPress={handleAddRoutine}>
                    <Text style={styles.buttonText}>Add Routine</Text>
                </TouchableOpacity>
            </View>

        </View>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        width: "100%",
    }, // End of container

    title: {
        fontSize: 32,
        fontFamily: "Sofia-Sans",
        textAlign: "left",
        marginTop: 20,
        marginLeft: 20,
    }, // End of title

    closeButton: {
      position: 'absolute',
      top: 25,
      right: 20,
      marginRight: 10,
      zIndex: 999,
    },

    contentContainer: {
        flex: 1,
        alignSelf: "flex-start",
        margin: 20,
      }, // End of contentContainer

    buttonContainer: {
        width: "110%",
        backgroundColor: "#FFFFFF",
        
        // Border
        borderRadius: 75,
        borderWidth: 2,
        borderBottomColor: "rgba(0, 0, 0, 0)",
        borderLeftColor: "rgba(0, 0, 0, 0)",
        borderRightColor: "rgba(0, 0, 0, 0)",
        borderColor: "rgba(0, 0, 0, 0.1)",
        
        // Alignment
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
    }, // End of buttonContainer    

    inputName: {
        width: screenWidth - 40,
        height: 70,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        alignSelf: "center",
        marginBottom: 20,
        fontFamily: "Sofia-Sans",
        fontSize: 24,
        padding: 20,
        // Style depending on iOS vs Android
        ...Platform.select({
          ios: {
            shadowColor: "rgba(0, 0, 0, 0.25)",
            shadowOffset: {
              width: 2,
              height: 4,
              
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
    
          },
          android: {
            elevation: 5,
          },
        }),
    }, // End of input

    inputLabel: {
        fontSize: 24,
        fontFamily: "Sofia-Sans",
        color: "#535353",
        marginBottom: 10,
        textAlign: "left",
    }, // End of inputLabel

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

    buttons: {
        width: "85%",
        height: 60,
        backgroundColor: "#D0F2DA",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 2,
        marginBottom: 5,
      }, // End of buttons
    
      buttonText: {
        fontSize: 28,
        fontFamily: "Sofia-Sans",
        color: "#64BBA1",
        textAlign: "center",
      }, // End of buttonText
  });

export default AddRoutine;
