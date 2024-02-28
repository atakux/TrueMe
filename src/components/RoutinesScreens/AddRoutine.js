import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebase'; 
import { useAuth } from '../../utils/AuthContext';
import { useRoutineContext } from '../../utils/RoutineContext';


const AddRoutine = ({ route }) => {
    const navigation = useNavigation();
    const [routineTitle, setRoutineTitle] = useState('');
    const user = useAuth(); // Assuming you have a custom hook to get the authenticated user
    const { updateDailyRoutines } = route.params;

    const handleAddRoutine = async () => {
      try {
        // Add routine to user's collection in Firestore
        const routinesDocRef = collection(FIRESTORE_DB, 'users', user.uid, 'routines');
        const docRef = await addDoc(routinesDocRef, {
          title: routineTitle,
        });
        // Call the update function passed from HomeScreen
        updateDailyRoutines({ id: docRef.id, title: routineTitle });

        console.log('DEBUG: Routine', docRef.id, 'added successfully');

        // Navigate back to HomeScreen
        navigation.goBack();
      } catch (error) {
        console.error('DEBUG: Error adding routine: ', error);
        // Handle error
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add Routine</Text>
        <TextInput
          style={styles.input}
          placeholder="Routine Title"
          value={routineTitle}
          onChangeText={setRoutineTitle}
        />
        <Button title="Add Routine" onPress={handleAddRoutine} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
  });

export default AddRoutine;
