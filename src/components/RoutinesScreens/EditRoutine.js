import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../utils/AuthContext';
import { loadFonts } from '../../utils/FontLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { updateRoutine } from '../../utils/FirestoreDataService';

const screenWidth = Dimensions.get('window').width;

const EditRoutine = ({ route }) => {    
    const navigation = useNavigation();
    const user = useAuth(); 
    const oldRoutine = route.params.routineData;
    const refreshSwiper = route.params.refreshSwiper;

    console.log("DEBUG: route:", route);
    console.log("DEBUG: oldRoutine:", oldRoutine);

    const oldRoutineName = oldRoutine.title;
    const oldSelectedDays = oldRoutine.days;
    const oldSteps = oldRoutine.steps;

    const [fontLoaded, setFontLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Routines related consts
    const [newRoutineName, setNewRoutineName] = useState('');
    const [errors, setErrors] = useState([]);
    
    // Days consts
    const [newSelectedDays, setNewSelectedDays] = useState([]);
    const [newSelectedDaysCount, setNewSelectedDaysCount] = useState(0); 

    // Steps consts
    const [newSteps, setNewSteps] = useState([]);
    const [newStepName, setNewStepName] = useState('');
    const [selectedStep, setSelectedStep] = useState(null);
    const [stepErrors, setStepErrors] = useState([]); // Errors for modulars

    const [modalVisible, setModalVisible] = useState(false);

    // Load fonts
    useEffect(() => {
      const loadAsyncData = async () => {
        await loadFonts();
        setFontLoaded(true);
      };
      loadAsyncData();

      setNewSelectedDays(oldSelectedDays);
      setNewSteps(oldSteps);
    }, [user, refreshSwiper]);

    // Update selected days count whenever newSelectedDays changes
    useEffect(() => {
      setNewSelectedDaysCount(newSelectedDays.length);
    }, [newSelectedDays]);

    if (!fontLoaded || user === null) {
      // Font is still loading or user is not logged in
      return null;
    }

    // Add routine 
    const handleEditRoutine = async () => {
      try {
        setIsLoading(true);
        setErrors([]);

        // Validate inputs
        if (newRoutineName === '') {
          setNewRoutineName(oldRoutineName);
        } else if (newSelectedDaysCount === 0) {
          console.log('DEBUG: Cant be 0 days selected');
          setErrors((prevErrors) => [...prevErrors, 'Please select at least one day for your routine']);
          return;
        } else if (newSteps.length === 0) {
          console.log('DEBUG: Steps cannot be empty');
          setErrors((prevErrors) => [...prevErrors, 'Please add at least one step']);
          return;
        } 

        const editedRoutine = {
          title: newRoutineName ? newRoutineName : oldRoutineName,
          days: newSelectedDays,
          steps: newSteps
        };

        await updateRoutine(user.uid, oldRoutine.id, editedRoutine);

        refreshSwiper();
        // Navigate back to HomeScreen
        navigation.navigate('HomeScreen');

      } catch (error) {
        console.error('DEBUG: Error updating routine: ', error);
      } finally {
        setIsLoading(false);
      }
    }; // End handleAddRoutine

    // This function generates the header text for the steps.
    const generateStepsHeaderText = () => {
      const stepCount = newSteps.length;
      if (stepCount === 0) {
        return "Steps";
      } else if (stepCount === 1) {
        return `${stepCount} step`;
      } else {
        return `${stepCount} steps`;
      }
    };

    // Click handler for each step
    const handleClickStep = (step) => {
      setSelectedStep(step);
    };

    // Add step 
    const handleAddStep = (newStepName) => {
      if (!newStepName.trim()) {
        console.log('DEBUG: Step name cannot be empty');
        setStepErrors((prevErrors) => [...prevErrors, 'Please enter a step name']);
        return;
      } else {
        setStepErrors([]);

        setNewSteps([...newSteps, newStepName]);
        setModalVisible(false);
        setNewStepName(''); // Reset newStepName after adding step
      }
    };
    
    // Edit step
    const handleEditStep = () => {
      if (!newStepName.trim()) {
        // If step name is empty, set it to the previous value
        setNewStepName(selectedStep);
      } else {
        const updatedSteps = newSteps.map(step => {
          if (step === selectedStep) {
            return newStepName;
          }
          return step;
        });
        setNewSteps(updatedSteps);
      }
      setModalVisible(false); // Close the modal after editing
      setSelectedStep(null);
      setNewStepName(''); // Reset newStepName after editing
    };
    
    // Delete step 
    const handleDeleteStep = () => {
      const updatedSteps = newSteps.filter(step => step !== selectedStep);
      setNewSteps(updatedSteps);
      setSelectedStep(null);
      setNewStepName(''); // Reset newStepName after deleting step
    };

    // Toggle modal visibility
    const toggleModal = () => {
      setModalVisible(!modalVisible);
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
            {/* Close Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Edit Routine '{oldRoutineName}'</Text>

            {/* Error Message */}
            {errors.map((error, index) => (
                    <Text key={index} style={styles.errorMessage}>
                        {" ▸ " + error}
                    </Text>
            ))}
            
            {/* Main content container for Add Routine screen */}
            <View style={styles.contentContainer}>

                {/* Routine name user must enter */}
                <Text style={styles.inputLabel}>Name</Text>

                <TextInput
                    style={styles.inputName}
                    placeholder={oldRoutineName}
                    value={newRoutineName}
                    onChangeText={setNewRoutineName}
                />

                {/* Days of the week user can select for their routine */}
                <Text style={styles.inputLabel}>Days</Text>

                <View style={styles.daysContainer}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.dayButton, newSelectedDays.includes(index) && styles.selectedDayButton]}
                      onPress={() => {
                        if (newSelectedDays.includes(index)) {
                          setNewSelectedDays(newSelectedDays.filter(item => item !== index));
                        } else {
                          setNewSelectedDays([...newSelectedDays, index]);
                        }
                      }}>
                      <Text style={styles.dayText}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                </View> 
                
                {/* Display selected days count */}
                <Text style={styles.tinyText}>Selected {newSelectedDaysCount} days</Text>

                {/* Steps user can add to their routine */}
                <Text style={styles.inputLabel}>{generateStepsHeaderText()}</Text>

                <TouchableOpacity style={styles.buttons} onPress={toggleModal}>
                    <Image source={require('../../../assets/icons/plus.png')}/>
                </TouchableOpacity>

                {/* Directions for reordering newSteps */}
                <Text style={styles.tinyText}>Press and hold to reorder</Text>

                {/* Modal for adding newSteps */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  
                  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        <TextInput
                          style={styles.modalInput}
                          placeholder="Enter step name"
                          onChangeText={setNewStepName}
                        />

                        {/* Error Message */}
                        {stepErrors.map((error, index) => (
                                <Text key={index} style={styles.errorMessage}>
                                    {"▸ " + error}
                                </Text>
                        ))}

                        <TouchableOpacity onPress={() => handleAddStep(newStepName)}>
                          <Text style={styles.addStepButton}>Add Step</Text>
                        </TouchableOpacity>

                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>

                {/* Display added newSteps */}
                <DraggableFlatList
                  data={newSteps}
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
                  onDragEnd={({ data }) => setNewSteps(data)} // Update newSteps state after reordering
                />

                {/* Modal for editing/deleting selected step */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={selectedStep !== null}
                  onRequestClose={() => setSelectedStep(null)}>

                  <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => setSelectedStep(null)}
                    >
                    
                    <View style={styles.modalContent}>
                      <TextInput
                        style={styles.modalInput}
                        placeholder={selectedStep}
                        onChangeText={text => setNewStepName(text)}
                      />
                      <TouchableOpacity onPress={() => handleEditStep(newStepName)}>
                        <Text style={styles.editStepButton}>Save Changes</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={handleDeleteStep}>
                        <Text style={styles.deleteStepButton}>Delete Step</Text>
                      </TouchableOpacity>
                    </View>
                    
                  </TouchableOpacity>
                </Modal>

            </View> 
            {/* End of contentContainer */}
            
            {/* Add Routine Button */}
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#64BBA1" />
              ) : (
                <TouchableOpacity style={styles.editRoutineButton} onPress={handleEditRoutine}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
              )}
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
      fontSize: 28,
      fontFamily: "Sofia-Sans",
      textAlign: "left",
      marginLeft: 20,
      marginTop: 50,
    }, // End of title

    cancelButton: {
      position: 'absolute',
      right: 20,
      margin: 10,
      zIndex: 999,
    }, // End of cancelButton

    cancelButtonText: {
      fontSize: 16,
      color: "red",
      fontFamily: "Sofia-Sans",
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
      borderTopColor: "rgba(0, 0, 0, 0.1)",
      
      // Alignment
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 15,
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
      fontSize: 22,
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

    tinyText: {
      fontSize: 16,
      fontFamily: "Sofia-Sans",
      color: "#535353",
      textAlign: "right",
      marginBottom: 13,
      marginRight: 2,
    }, // End of tinyText

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

    editRoutineButton: {
      width: "85%",
      height: 60,
      backgroundColor: "#D0F2DA",
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginTop: 2,
      marginBottom: 15,
    }, // End of editRoutinebutton
    
    buttonText: {
      fontSize: 28,
      fontFamily: "Sofia-Sans",
      color: "#64BBA1",
      textAlign: "center",
    }, // End of buttonText

    // Days
    dayText: {
      fontSize: 16,
      fontFamily: "Sofia-Sans",
      color: "#356553",
    }, // End of dayText

    daysContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    }, // End of daysContainer

    dayButton: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
    }, // End of dayButton

    selectedDayButton: {
      backgroundColor: '#64BBA1',
    }, // End of selectedDayButton

    // Modal
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }, // End of modalContainer

    modalContent: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    }, // End of modalContent

    modalInput: {
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      
      margin: 5,
      paddingHorizontal: 10,
      
      fontFamily: "Sofia-Sans",

      ...Platform.select({
        ios: {
          height: 50,
          width: screenWidth - 180,
          fontSize: 20,
        },

        android: {
          height: 50,
          width: screenWidth - 150,
          marginVertical: 10,
          fontSize: 18,
        },
      }),
    }, // End of modalInput
    
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
    }, // End of stepContainer

    stepText: {
      fontSize: 18,
      fontFamily: "Sofia-Sans",
      color: "#356553",
      marginLeft: 15,
    }, // End of stepText

    editStepButton: {
      fontSize: 18,
      fontFamily: "Sofia-Sans",
      color: "#64BBA1",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 5,
    }, // End of editStepButton
    
    deleteStepButton: {
      fontSize: 18,
      fontFamily: "Sofia-Sans",
      color: "red",
      textAlign: "center",
      marginTop: 5,
      marginBottom: 5,
    }, // End of deleteStepButton

    addStepButton: {
      fontSize: 22,
      fontFamily: "Sofia-Sans",
      color: "#64BBA1",
      textAlign: "center",
      marginTop: 5,
    }, // End of addStepButton
    
  });

export default EditRoutine;
