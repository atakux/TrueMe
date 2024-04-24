import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, Alert, ActivityIndicator, Platform, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';
import { getSkinAnalysisResults } from '../../utils/FirestoreDataService';

import generateSuggestedSkincareRoutine from '../../utils/GenerateRoutine';

const screenWidth = Dimensions.get('window').width;

const ResultScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [results, setResults] = useState(null);
    const [skinType, setSkinType] = useState("");
    const [showModal, setShowModal] = useState(false); // State variable for modal visibility
    const [suggestedRoutine, setSuggestedRoutine] = useState(null); // State variable to store the suggested routine
    const user = useAuth();

    useEffect(() => {
        const loadAsyncData = async () => {
            await loadFonts();
            setFontLoaded(true);
            const skinAnalysisResults = await getSkinAnalysisResults(user.uid);
            if (skinAnalysisResults) {
                console.log("DEBUG: Skin analysis results:", skinAnalysisResults[0].prediction);
                setResults(skinAnalysisResults[0].prediction);

                // Determine skin type
                const normal = skinAnalysisResults[0].prediction.normal;
                const dry = skinAnalysisResults[0].prediction.dry;
                const oily = skinAnalysisResults[0].prediction.oily;
                if (dry > normal && dry > oily) {
                    setSkinType('Dry');
                } else if (oily > normal && oily > dry) {
                    setSkinType('Oily');
                } else if (normal > dry && normal > oily) {
                    setSkinType('Normal');
                } else {
                    setSkinType('Combination');
                }

                // Generate suggested skincare routine
                const generatedRoutine = await generateSuggestedSkincareRoutine(skinType.toLowerCase(), skinAnalysisResults[0].prediction);
                console.log("DEBUG: Generated routine:", generatedRoutine);
                setSuggestedRoutine(generatedRoutine);
            } else {
                console.error("Error fetching skin analysis results.");
            }
        };

        loadAsyncData();
    }, [ user, getSkinAnalysisResults, skinType, setSuggestedRoutine, setSkinType ]);

    if (!fontLoaded || !results || !suggestedRoutine) {
        return (
            <View style={styles.loadingIndicator}>
                  <ActivityIndicator size="large" color="#64BBA1"/>
            </View>
          );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Skin Diagnostic Results</Text>
                <TouchableOpacity style={{alignSelf: "flex-end", paddingBottom: 5, alignContent: "flex-end"}} onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../../../assets/icons/home-fill.png')} />
                </TouchableOpacity>
            </View>

            <View style={styles.results}>
                <Text style={styles.title}>Your Results</Text>
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultText}>Your Skin Type:</Text>
                    <Text style={styles.skinType}>{skinType}</Text>
                    <Text style={styles.modalText}>
                        You have <Text style={{ color: "#64BBA1" }}>{skinType.toLowerCase()} skin type </Text> and the conditions that are likely are
                        {   
                            Object.entries(results)
                                .filter(([key]) => key !== "normal" && key !== "oily" && key !== "dry") // Filter out "normal", "oily", and "dry"
                                .sort(([, a], [, b]) => b - a) // Sorting based on prediction values
                                .map(([key], index, array) => {
                                    const prediction = results[key];
                                    if (prediction > 0.05) {
                                        // If the prediction is above 0.05, render the prediction text
                                        return (
                                            <View key={index}>
                                                <Text style={{ paddingTop: 5, fontSize: 16, fontFamily: 'Sofia-Sans', color: "#964BBB" }}>
                                                    {index === 0 ? '  ' : index == 2 ? ' and  ' : ''}
                                                    {key.split('_').map(word => word.charAt(0).toLowerCase() + word.slice(1)).join(' ')}
                                                    {index < 2 ? ', ' : ''}
                                                </Text>
                                            </View>
                                        );
                                    } else {
                                        // If the prediction is below or equal to 0.05, do not render
                                        return null;
                                    }
                                })}.
                        {
                            // Check if there are no conditions above 0.05
                            !Object.entries(results)
                                .filter(([key]) => key !== "normal" && key !== "oily" && key !== "dry")
                                .some(([_, prediction]) => prediction > 0.05) &&
                            <Text style={{ color: "#964BBB" }}>
                                There are no conditions in particular to be wary about!
                            </Text>
                        }
                    </Text>
                    <Text style={styles.modalText}>
                        Review your suggested <Text style={{ color: "#964BBB" }}>products</Text> and <Text style={{ color: "#64BBA1" }}>routines</Text> by clicking the buttons below and review your skin analysis results.
                    </Text>
                </View>
            </View>



            <View style={{flexDirection: 'row', marginBottom: "15%", justifyContent: "space-between"}}>
                <View style={styles.moreInfo}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={{ ...styles.button, backgroundColor: "#9464BB", marginBottom: 10 }}
                            onPress={() => {navigation.navigate('Shop'); }}>
                            <Text style={styles.buttonText}>View Skin Care Products</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.button, backgroundColor: "#64BBA1", marginTop: 10, marginBottom: 10 }}
                            onPress={() => {
                                navigation.navigate('SuggestedRoutine', { routine: suggestedRoutine }); // Pass the suggested routine to SuggestedRoutine component
                            }}>
                            <Text style={styles.buttonText}>View Skin Care Routine</Text>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* Display the results in a scrollable list */}
                <ScrollView style={styles.scrollView}>
                    {Object.keys(results).sort().map((key, index) => (  
                        <View key={index}>
                            <View style={styles.details}>
                                <Text style={styles.detailsText}>{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Text>
                                <View style={styles.statusBarContainer}>
                                    <View style={styles.statusBar}>
                                        <View style={[styles.statusBarFill, { width: (results[key] <= 0.30 ? (parseFloat(results[key]) * 200) : results[key] * 100) + '%' }]} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#000', // You can customize the text color
        fontFamily: 'Sofia-Sans',
        width: "90%",
        textAlign: 'center',
        alignSelf: "center",
      },

    loadingIndicator: {
        marginTop: 300,
    },

    closeButton: {
        fontSize: 18,
        fontFamily: 'Sofia-Sans',
        textAlign: "center",
        color: "#007AFF",
        marginTop: 20,
    },

    resultsContainer: {
        height: "auto",
        width: screenWidth - 50,
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 20,
        margin: 20,
        alignSelf: 'center',

        ...Platform.select({
            ios: {
                shadowColor: "black",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.25,
                elevation: 5,
            },
            android: {
                elevation: 5,
            },
        }),
    },

    scrollView: {
        flex: 1,
        marginRight: "5%",
        marginBottom: 450,
        overflow: 'scroll',
        height: "auto",
    },

    results: {
        marginTop: 20,
        marginBottom: 10,
    },

    skinType: {
        fontSize: 32,
        fontFamily: 'Sofia-Sans',
        letterSpacing: 5,
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 20,
    },

    buttonContainer: {
        marginTop: 50,
        alignSelf: 'center',
    },

    details: {
        
        width: screenWidth - 100,

    },

    moreInfo: {
        alignSelf: "flex-start",
        borderRadius: 10,

        ...Platform.select({
            ios: {
                width: screenWidth - 250,
                height: 250,
                margin: 30,
                marginRight: 35,
            },

            android: {
                width: screenWidth - 220,
                height: 250,
                margin: 20,
                marginRight: 25,
            }
        })
    },

    moreInfoText: {
        fontSize: 20,
        fontFamily: 'Sofia-Sans',
        color: '#9464BB',
        textAlign: 'left',
        alignSelf: 'center',
        margin: 15,
    },

    detailsText: {
        fontSize: 18,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: 'left',
        marginLeft: 2,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        marginRight: 20,
        paddingLeft: 12,
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },

    statusBar: {
        alignSelf: "center",
        backgroundColor: '#E0E0E0',
        height: 5,
        borderRadius: 50,
        width: '65%', 
    },
  
    statusBarFill: {
        height: '100%',
        backgroundColor: '#64BBA1',
        borderRadius: 50,
        width: '100%',
    },

    statusBarText: {
        fontSize: 14,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: "left",
        alignSelf: "flex-start",
    },
    
    statusBarContainer : {
        flexDirection: 'row',
        borderRadius: 10,
        width: '80%',
        paddingLeft: 10,
        paddingRight: 10, 
        paddingBottom: 10,
        paddingTop: 10,
    },

    headerText: {
        fontSize: 28,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',

        ...Platform.select({
            ios: {
                marginHorizontal: 15,
            },
            android: {
                marginHorizontal: 3,
            }
        }),
    },

    title: {
        fontSize: 36,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: 'left',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },

    resultText: {
        fontSize: 24,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: 'left',
        alignSelf: 'flex-start',
        letterSpacing: 2,
    },

    // Modal styles
    modalText: {
        marginBottom: 15,
        textAlign: "left",
        fontSize: 18,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: 'left',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginHorizontal: 5,
    },
    buttonContainer: {
        flexDirection: "column",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonText: {
        color: "white",
        fontFamily: 'Sofia-Sans',
        textAlign: "center",
        fontSize: 16
    },
});

export default ResultScreen;

