import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';

const screenWidth = Dimensions.get('window').width;


const GetStarted = () => {
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
                <Text style={styles.title}>Welcome, {user.displayName}</Text>
            </View>

            <View style={styles.midContainer}>
                <Image source={require('../../../assets/images/facial-recognition.png')} style={styles.image} />
                <Text style={styles.mainText}>Facial Recognition</Text>
                <Text style={styles.text}>The first step to your skin care journey.</Text>
            </View>

            {/* Get Started Button */}
            <View style={styles.buttonContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color="#64BBA1" />
                ) : (
                  <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('DiagnosticScreen')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                  </TouchableOpacity>
                )}
              </View>

        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    midContainer: {
        marginTop: 220,
        alignSelf: 'center',
    },

    buttonContainer: {
        marginTop: 180,
        alignSelf: 'center',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },

    backButton: {
        alignSelf: 'flex-start',
    },

    backIcon: {
        width: 20,
        height: 20,
    },

    title: {
        fontSize: 28,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 50,
    },

    mainText: {
        fontSize: 22,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 50,
        marginTop: 20,
        letterSpacing: 1.5,
    },

    text: {
        fontSize: 18,
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 50,
        marginTop: 10,
    },

    image: {
        alignSelf: 'center',
    },

    getStartedButton: {
        width: screenWidth - 40,
        height: 60,
        backgroundColor: "#D0F2DA",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 10,
    }, // End of getStartedbutton
      
    buttonText: {
        fontSize: 28,
        fontFamily: "Sofia-Sans",
        color: "#64BBA1",
        textAlign: "center",
    }, // End of buttonText

});

export default GetStarted;