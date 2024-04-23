import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { addRoutine, fetchDailyRoutines } from '../../utils/FirestoreDataService';
import { useAuth } from '../../utils/AuthContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SuggestedRoutine = ({ route }) => {
    const navigation = useNavigation();
    const user = useAuth();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [dailyRoutines, setDailyRoutines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(false);

    const { routine } = route.params;

    const routineData = routine;
    const routineName = routineData.title;
    const routineDays = routineData.days;
    const routineSteps = routineData.steps;

    console.log("DEBUG: Route: ", route);
    console.log("DEBUG: Routine Data:", routineData);

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
    
    useEffect(() => {
        const fetchAcceptanceStatus = async () => {
            try {
                
                const value = await AsyncStorage.getItem(`acceptedRoutine_${user.uid}`);

                setAccepted(value);
                console.log("DEBUG: Acceptance Status: ", value);
                    
            } catch (error) {
                console.error('Error fetching acceptance status:', error);
            }
        };
    
        fetchAcceptanceStatus();
    }, [accepted, setAccepted]);

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
                        <View style={styles.checkbox}/>
                        <Text style={[styles.checklistText]}>{step}</Text>
                    </View>
                ))}
            </View>
        );
    };

    useEffect(() => {
        console.log("DEBUG: Accepted changed:", accepted);
    }, [accepted]); // This useEffect will run whenever 'accepted' state changes
    
    const handleAccept = async () => {
        setLoading(true);
        try {
            await addRoutine(user.uid, routineData, updateDailyRoutines);

            // Store acceptance status in AsyncStorage using the updated routineId
            await AsyncStorage.setItem(`acceptedRoutine_${user.uid}`, 'true');
            setAccepted(true);

            navigation.navigate('Home');
        } catch (error) {
            console.error('Error accepting routine:', error);
            // Handle error (e.g., show error message)
        } finally {
            setLoading(false);
        }
    };

    const renderAcceptButton = () => {
        console.log("DEBUG: Accepted: ", accepted);
        if (!accepted || accepted === false) {
            return (
                <View style={styles.bottomPanel}>
                    <TouchableOpacity onPress={handleAccept}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Accept Routine</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    // Update daily routines
    const updateDailyRoutines = (newRoutine) => {
        setDailyRoutines([...dailyRoutines, newRoutine]);
    };

    return (
        <SafeAreaView style={styles.container}>
            { loading ? (
                <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator}/>
            ) : (
                <View style={styles.container}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                        <Image source={require('../../../assets/icons/close.png')} style={styles.closeButtonImage} />
                    </TouchableOpacity>
                    
                    <Text style={styles.title}>Suggested Routine</Text>

                    <Text style={styles.routineTitle}>{routineName}</Text>

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

                    {/* Accept and Decline buttons */}
                    {renderAcceptButton()}
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        width: "100%",
    }, // End of container

    statusBar: {
        alignSelf: "center",
        backgroundColor: '#E0E0E0',
        height: 10,
        borderRadius: 50,
        width: '90%',
        margin: 10,
        marginHorizontal: 20
    },
  
    statusBarFill: {
        height: '100%',
        backgroundColor: '#64BBA1',
        borderRadius: 50,
        width: '100%',
    },
  
    statusBarText: {
        fontSize: 18,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: "left",
        alignSelf: "flex-start",
        margin: 5,
        marginTop: 30,
        marginLeft: 20
    },

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
        marginTop: 20,
        marginBottom: 20,
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

    routineTitle: {
        fontSize: 24,
        fontFamily: "Sofia-Sans",
        textAlign: "left",
        marginTop: 20,
        marginLeft: 20,
    }, // End of title

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
        flex: 1,
        marginBottom: 5,
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

    icon: {
        width: 32,
        height: 32,
        marginLeft: 10,
        marginHorizontal:10,
    }, // End of icon

    bottomPanel: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        marginTop: 10,
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
        alignSelf: "center",
        paddingTop: 15,
    }, // End of bottomPanel
    button: {
        backgroundColor: '#64BBA1',
        borderRadius: 5,
        marginHorizontal: 10,
        width: 200,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Sofia-Sans',
        paddingHorizontal: 20,
        paddingVertical: 10,
        textAlign: 'center',
    }
});

export default SuggestedRoutine;