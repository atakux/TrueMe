import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebase'; 
import { useAuth } from '../../utils/AuthContext';
import { useRoutineContext } from '../../utils/RoutineContext';
import { loadFonts } from '../../utils/FontLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';

const screenWidth = Dimensions.get('window').width;

const AddRoutine = ({ route }) => {
    const navigation = useNavigation();
    const [routineName, setRoutineName] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [steps, setSteps] = useState([]);
    const [stepName, setStepName] = useState('');
    const [selectedStep, setSelectedStep] = useState(null); // State to keep track of selected step
    const user = useAuth(); 
    const { updateDailyRoutines } = route.params;
    const [errors, setErrors] = useState([]);
    const [selectedDaysCount, setSelectedDaysCount] = useState(0); // State to keep track of selected days count
    const [modalVisible, setModalVisible] = useState(false);

    // Load fonts
    useEffect(() => {
      const loadAsyncData = async () => {
        await loadFonts();
      };
      loadAsyncData();
    }, []);

    useEffect(() => {
      // Update selected days count whenever selectedDays changes
      setSelectedDaysCount(selectedDays.length);
    }, [selectedDays]);

    // Add routine 
    const handleAddRoutine = async () => {
      try {
        setErrors([]);

        if (routineName === '') {
          console.log('DEBUG: Routine title cannot be empty');
          setErrors((prevErrors) => [...prevErrors, 'Please enter a routine name']);
          return;
        } else if (selectedDaysCount === 0) {
          console.log('DEBUG: Cant be 0 days selected');
          setErrors((prevErrors) => [...prevErrors, 'Please select at least one day for your routine']);
          return;
        }

        // Add routine to user's routines collection in Firestore
        const routinesDocRef = collection(FIRESTORE_DB, 'users', user.uid, 'routines');
        const docRef = await addDoc(routinesDocRef, {
          title: routineName,
          days: selectedDays,
          steps: steps,
        });
        // Call the update function passed from HomeScreen to update dynamically
        updateDailyRoutines({ id: docRef.id, title: routineName, days: selectedDays });

        console.log('DEBUG: Routine', routineName, 'added successfully');

        // Navigate back to HomeScreen
        navigation.goBack();
      } catch (error) {
        console.error('DEBUG: Error adding routine: ', error);
      }
    }; // End handleAddRoutine

    const handleClickStep = (step) => {
      setSelectedStep(step);
    };

    const handleAddStep = (stepName) => {
      setSteps([...steps, stepName]);
      setModalVisible(false);
      setStepName(''); // Reset stepName after adding step
    };
    
    const handleEditStep = () => {
      if (!stepName.trim()) {
        // If step name is empty, set it to the previous value
        setStepName(selectedStep);
      } else {
        const updatedSteps = steps.map(step => {
          if (step === selectedStep) {
            return stepName;
          }
          return step;
        });
        setSteps(updatedSteps);
      }
      setModalVisible(false); // Close the modal after editing
      setSelectedStep(null);
      setStepName(''); // Reset stepName after editing
    };
    
    const handleDeleteStep = () => {
      const updatedSteps = steps.filter(step => step !== selectedStep);
      setSteps(updatedSteps);
      setSelectedStep(null);
      setStepName(''); // Reset stepName after deleting step
    };

    const toggleModal = () => {
      setModalVisible(!modalVisible);
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
            {/* Close Button */}
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
                {/* Routine name user must enter */}
                <Text style={styles.inputLabel}>Name</Text>

                <TextInput
                    style={styles.inputName}
                    placeholder="Daily Routine"
                    value={routineName}
                    onChangeText={setRoutineName}
                />

                {/* Days of the week user can select for their routine */}
                <Text style={styles.inputLabel}>Days</Text>

                <View style={styles.daysContainer}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.dayButton, selectedDays.includes(index) && styles.selectedDayButton]}
                      onPress={() => {
                        if (selectedDays.includes(index)) {
                          setSelectedDays(selectedDays.filter(item => item !== index));
                        } else {
                          setSelectedDays([...selectedDays, index]);
                        }
                      }}>
                      <Text style={styles.dayText}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                </View> 
                
                {/* Display selected days count */}
                <Text style={styles.selectedDaysCount}>Selected {selectedDaysCount} days</Text>

                {/* Steps user can add to their routine */}
                <Text style={styles.inputLabel}>Steps</Text>

                <TouchableOpacity style={styles.buttons} onPress={toggleModal}>
                    <Image source={require('../../../assets/icons/plus.png')}/>
                </TouchableOpacity>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}>
                    
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Enter step name"
                        onChangeText={setStepName}
                      />

                      <TouchableOpacity onPress={() => handleAddStep(stepName)}>
                        <Text style={styles.addStepButton}>Add Step</Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                </Modal>

                {/* Display added steps */}
                <DraggableFlatList
                  data={steps}
                  renderItem={({ item, index, drag, isActive }) => (
                    <TouchableOpacity
                      style={[
                        styles.stepContainer,
                        isActive && { backgroundColor: 'rgba(0, 0, 0, 0.1)' }, // Optional: Highlight the active item while dragging
                      ]}
                      onLongPress={drag}
                      onPress={() => handleClickStep(item)}
                    >
                      <Text style={styles.stepText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => `step-${index}`}
                  onDragEnd={({ data }) => setSteps(data)} // Update steps state after reordering
                />


                {/* Modal for editing/deleting selected step */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={selectedStep !== null}
                  onRequestClose={() => setSelectedStep(null)}>
                    
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder={selectedStep}
                      onChangeText={text => setStepName(text)}
                    />
                        <TouchableOpacity onPress={() => handleEditStep(stepName)}>
                          <Text style={styles.editStepButton}>Save Changes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleDeleteStep}>
                          <Text style={styles.deleteStepButton}>Delete Step</Text>
                        </TouchableOpacity>

                        
                    </View>

                  </View>
                </Modal>
            </View>
            

            {/* Add Routine Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addRoutineButton} onPress={handleAddRoutine}>
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
        height: 65,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        alignSelf: "center",
        marginBottom: 40,
        fontFamily: "Sofia-Sans",
        fontSize: 23,
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
        marginBottom: 15,
        marginTop: 5,
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

    dayText: {
        fontSize: 16,
        fontFamily: "Sofia-Sans",
        color: "#356553",
    },

    // Buttons
    buttons: {
        width: screenWidth - 40,
        height: 45,
        backgroundColor: "#D0F2DA",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 2,
        marginBottom: 10,
        opacity: 0.85,
    }, // End of buttons

    addRoutineButton: {
        width: "85%",
        height: 60,
        backgroundColor: "#D0F2DA",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 2,
        marginBottom: 5,
      }, // End of addRoutinebutton
    
    buttonText: {
      fontSize: 28,
      fontFamily: "Sofia-Sans",
      color: "#64BBA1",
      textAlign: "center",
    }, // End of buttonText

    addStepButton: {
      fontSize: 22,
      fontFamily: "Sofia-Sans",
      color: "#64BBA1",
      textAlign: "center",
      marginTop: 5,
      
    },

    // Days
    daysContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },

    dayButton: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
    },

    selectedDayButton: {
      backgroundColor: '#64BBA1',
    },

    selectedDaysCount: {
      fontSize: 16,
      fontFamily: "Sofia-Sans",
      color: "#535353",
      textAlign: "right",
      marginBottom: 13,
      marginRight: 2,
    },

    // Modal
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    modalInput: {
      height: 50,
      width: screenWidth - 180,
      
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      
      margin: 5,
      paddingHorizontal: 10,
      
      fontFamily: "Sofia-Sans",
      fontSize: 20,
    },
    
    // Steps
    stepContainer: {
      width: screenWidth - 60,
      height: 40,

      backgroundColor: "#FFFFFF",
      
      borderRadius: 5,
      borderColor: "#64BBA1",
      borderStyle: "solid",
      borderWidth: 0.25,

      flexDirection: 'row',
      alignItems: 'center',
      
      marginTop: 5,
      marginHorizontal: 10,
    },

    stepText: {
        fontSize: 18,
        fontFamily: "Sofia-Sans",
        color: "#356553",
        marginLeft: 15,
    },

    editStepButton: {
      fontSize: 18,
      fontFamily: "Sofia-Sans",
      color: "#64BBA1",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 5,
    },
    
    deleteStepButton: {
      fontSize: 18,
      fontFamily: "Sofia-Sans",
      color: "red",
      textAlign: "center",
      marginTop: 5,
      marginBottom: 5,
    },
    
  });

export default AddRoutine;
