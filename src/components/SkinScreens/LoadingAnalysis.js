import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const FacialAnalysisLoadingScreen = () => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Simulate asynchronous facial analysis tasks
        const loadTasks = async () => {
            try {
                // Loop through checklist items
                for (let i = 0; i < checklistItems.length; i++) {
                    // Wait for 1 second per task
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    // Update currentIndex
                    setCurrentIndex(i);
                }

                await new Promise(resolve => setTimeout(resolve, 2000)); 

                // Once all tasks are completed, navigate to the result screen
                navigation.navigate('ResultScreen');
            } catch (error) {
                console.error('Error performing facial analysis:', error);

                navigation.navigate('GetStarted');
            }
        };

        loadTasks();
    }, []); // Empty dependency array ensures the effect runs only once

    const checklistItems = [
        'Detecting facial landmarks',
        'Analyzing skin condition',
        'Identifying abnormalities',
        'Facial analysis complete!',
    ];

    return (
        <View style={styles.container}>

            <ActivityIndicator size="large" color="#64BBA1" />
            
            <Text style={styles.loadingText}>Performing facial analysis...</Text>
            
            <View style={styles.checklistContainer}>
                {checklistItems.map((item, index) => (
                    <View key={index} style={[styles.checklistItem, { opacity: index === currentIndex ? 1 : 0 }]}>
                        <Text style={styles.checklistText}>{item}</Text>
                    </View>
                ))}
                <View style={styles.dotsContainer}>
                    {[0, 1, 2, 3].map((index) => (
                        <View key={index} style={[styles.dot, { backgroundColor: index === currentIndex ? '#64BBA1' : '#CCCCCC' }]} />
                    ))}
                </View>
            </View>
    
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
    },
    checklistContainer: {
        marginTop: 20,
        alignItems: 'center',
        width: '80%',
        height: 80,
        alignSelf: 'center',
        backgroundColor: '#D0F2DA',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 10,
        marginBottom: 50,
    },
    checklist: {
        alignItems: 'center',
        width: '100%',
    },
    checklistItem: {
        position: 'absolute',
        alignItems: 'center',
    },
    checklistText: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Sofia-Sans',
        color: '#64BBA1',
        margin: 15,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#CCCCCC',
        marginHorizontal: 5,
    },
});

export default FacialAnalysisLoadingScreen;
