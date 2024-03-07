import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';

const screenWidth = Dimensions.get('window').width;

const ResultScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [fontLoaded, setFontLoaded] = useState(false);
    const user = useAuth();

    useEffect(() => {
        const loadAsyncData = async () => {
            await loadFonts();
            setFontLoaded(true);
        };

        loadAsyncData();
    }, []);

    if (!fontLoaded) {
        return null;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../../../assets/icons/back.png')} style={styles.backIcon}/>
                </TouchableOpacity>
                <Text style={styles.headerText}>Skin Diagnostic Results</Text>
                <TouchableOpacity style={{alignSelf: "flex-end", paddingBottom: 5}} onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../../../assets/icons/home-fill.png')} />
                </TouchableOpacity>
            </View>

            <View style={styles.results}>
                <Text style={styles.title}>Your Results</Text>
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultText}>Your Skin Type:</Text>
                </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: 100, justifyContent: "space-between"}}>
                <View style={styles.moreInfo}>
                    <Text style={styles.moreInfoText}>Review suggested skin care products and routines</Text>
                    <TouchableOpacity style={{alignSelf: "center"}} onPress={() => console.log('More Info Pressed')}>
                        <Image source={require('../../../assets/icons/info.png')} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.scrollView}>
                    {[...Array(10)].map((_, index) => (
                        <View key={index}>
                            <View style={styles.details}>
                                <Text style={styles.detailsText}>Detail</Text>
                                <View style={styles.statusBarContainer}>
                                    <View style={styles.statusBar}>
                                        <View style={[styles.statusBarFill, { width: '50%' }]} />
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

    resultsContainer: {
        height: screenWidth - 150,
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
        flexGrow: 1,
        marginRight: 20,
        marginBottom: 200,
    },

    results: {
        marginTop: 20,
        marginBottom: 10,
    },

    buttonContainer: {
        marginTop: 50,
        alignSelf: 'center',
    },

    details: {
        
        width: screenWidth - 100,

    },

    moreInfo: {
        width: screenWidth - 250,
        height: 250,
        alignSelf: "flex-start",
        backgroundColor: "#D4CCDD",
        borderRadius: 10,
        margin: 30,
        marginRight: 35,
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
        width: '80%',
        flexDirection: 'row',

        padding: 5,
        marginBottom: 20,

        alignSelf: "flex-start",
    },

    backButton: {
        alignSelf: 'flex-start',
    },

    backIcon: {
        width: 20,
        height: 20,
        marginTop: 5
    },

    headerText: {
        fontSize: 28,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
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
    },
});

export default ResultScreen;