import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { deleteRoutine } from '../../utils/FirestoreDataService';
import { useAuth } from '../../utils/AuthContext';

const Routine = ({ route }) => {
    const navigation = useNavigation();
    const user = useAuth();

    const { routine, refreshSwiper } = route.params;

    const routineData = routine;
    const routineId = routineData.id;
    const routineName = routineData.title;
    const routineDays = routineData.days;
    const routineSteps = routineData.steps;

    console.log("DEBUG: Route: ", route);
    console.log("DEBUG: Routine Data:", routineData);

    const [completionStatus, setCompletionStatus] = useState(routineSteps ? Array(routineSteps.length).fill(false) : []);

    if (!routineData) {
        return <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator}/>;
    }
    // Array of day names
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get the current day of the week (0-6, where 0 is Sunday)
    const currentDate = new Date();
    const currentDayIndex = currentDate.getDay();

    // Calculate the offset to align the current day to the left
    const offset = currentDayIndex > 0 ? currentDayIndex - 0 : 6;

    // Function to render each day
    const renderDay = (dayIndex, dayNum, date) => {
        const dayName = dayNames[dayIndex];
        const isRoutineDay = routineDays.includes(dayIndex);
        const dayStyle = [styles.dayContainer];
        if (isRoutineDay) {
            dayStyle.push(styles.routineDay);
        }
        return (
            <View key={dayName} style={styles.dayWrapper}>
                <Text style={styles.dayDate}>{date}/{dayNum}</Text>
                <TouchableOpacity style={dayStyle}>
                    <Text style={styles.dayText}>{dayName}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Render the checklist of steps
    const renderChecklist = () => {
        return (
            <View>
                <Text style={styles.mainText}>Steps:</Text>
                {routineSteps.map((step, index) => (
                    <View key={index} style={styles.checklistItem}>
                        <TouchableOpacity onPress={() => toggleCompletion(index)}>
                            <View style={styles.checkbox}>
                                {completionStatus[index] && <Image source={require('../../../assets/icons/check.png')} style={styles.checkboxImage} />}
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.checklistText, completionStatus[index] && styles.completed]}>{step}</Text>
                    </View>
                ))}
            </View>
        );
    };

    // Function to toggle completion status of step
    const toggleCompletion = (index) => {
        const newStatus = [...completionStatus];
        newStatus[index] = !newStatus[index];
        setCompletionStatus(newStatus);
    };

    const handleEditRoutine = () => {
        console.log('DEBUG: Edit Routine button pressed');
    };

    // Function to handle routine deletion, asks for confirmation
    const handleDeleteRoutine = () => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete the routine '${routineName}'?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => processDeleteRoutine(routineId),
                    style: 'destructive',
                },
            ]
        );
    };

    // Function to delete routine
    const processDeleteRoutine = async (routineId) => {
        try {
            console.log(`DEBUG: Deleting routine '${routineName}'`);
            await deleteRoutine(user.uid, routineId);
            console.log(`DEBUG: Deleted routine '${routineName}'`);
            
            // Call the refresh function passed from HomeScreen to refresh the Swiper component
            refreshSwiper();
            navigation.navigate('HomeScreen');
        } catch (error) {
            console.error('Error deleting routine:', error);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../../../assets/icons/close.png')} style={styles.closeButtonImage} />
                </TouchableOpacity>
                <Text style={styles.title}>{routineName}</Text>

                <Text style={styles.todayText}>Today is {currentDate.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Text>

                <View style={styles.daysContainer}>
                    <Text style={styles.weekText}>This week:</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                        {/* Render empty views to shift days to align the current day to the left */}
                        {[...Array(offset)].map((_, index) => <View key={index}/>)}
                        
                        {/* Render routine days that appear above each day of the week */}
                        {dayNames.map((_, index) => {
                            const nextDate = new Date();
                            nextDate.setDate(currentDate.getDate() + index);
                            return renderDay((index + offset) % 7, nextDate.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 }), (nextDate.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 }));
                        })}
                    </ScrollView>
                </View>

                {/* Render the checklist */}
                {renderChecklist()}


                {/* Panel for pencil and trashcan icons */}
                <View style={styles.bottomPanel}>
                    <TouchableOpacity onPress={() => handleEditRoutine()}>
                        <Image source={require('../../../assets/icons/edit.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteRoutine()}>
                        <Image source={require('../../../assets/icons/delete.png')} style={styles.icon} />
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

    loadingIndicator: {
        marginTop: 300,
      }, // End of loadingIndicator  

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
    }, // End of closeButton

    todayText: {
        fontSize: 20,
        fontFamily: 'Sofia-Sans',
        color: '#64BBA1',
        textAlign: "center",
        marginTop: 30,
        marginBottom: 30,
    }, // End of todayText

    daysContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRadius: 20,
    }, // End of daysContainer

    weekText: {
        fontSize: 24,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: "left",
        margin: 10,
        marginTop: 30,
    }, // End of weekText

    mainText: {
        fontSize: 24,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: "left",
        margin: 20,
        marginTop: 40,
    }, // End of mainText

    dayWrapper: {
        alignItems: 'center',
    }, // End of dayWrapper

    dayContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginRight: 10,
    }, // End of dayContainer

    dayText: {
        fontSize: 16,
    }, // End of dayText

    dayDate: {
        fontSize: 12,
        color: '#808080',
        marginBottom: 5,
        marginRight: 10,
    }, // End of dayDate

    routineDay: {
        backgroundColor: '#64BBA1', // Change to the color you want for routine days
    }, // End of routineDay

    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 40,
        marginBottom: 10,
    }, // End of checklistItem

    checklistText: {
        fontSize: 18,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        marginHorizontal: 5,
    }, // End of checklistText

    completed: {
        textDecorationLine: 'line-through',
        color: '#808080',
    }, // End of completed

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#64BBA1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    }, // End of checkbox

    checkboxImage: {
        width: 20,
        height: 20,
    }, // End of checkbox

    bottomPanel: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
    }, // End of bottomPanel

    icon: {
        width: 32,
        height: 32,
        marginLeft: 10,
        marginHorizontal:10,
    }, // End of icon
});

export default Routine;
