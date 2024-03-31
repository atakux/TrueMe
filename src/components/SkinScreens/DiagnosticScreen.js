import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';

import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';

const DiagnosticScreen = () => {
    const navigation = useNavigation();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        const loadAsyncData = async () => {
            await loadFonts();
            setFontLoaded(true);
        };

        loadAsyncData();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (!fontLoaded || hasPermission === null) {
        return null; // You may want to display a loading indicator here
    }

    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }

    const toggleCameraType = () => {
        setCameraType(
            cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../../../assets/icons/back.png')} style={styles.backIcon}/>
                </TouchableOpacity>
                <Text style={styles.title}>Skin Diagnostic Test</Text>
            </View>

            <View style={{ flex: 1 }}>
                <Camera style={{ flex: 1 }} type={cameraType} />
            </View>

            <TouchableOpacity style={styles.cameraToggleButton} onPress={toggleCameraType}>
                <Text style={styles.cameraToggleText}>Toggle Camera</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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

        ...Platform.select({
            ios: {
                marginHorizontal: 50,
            },
            android: {
                marginHorizontal: 30,
            }
        }),
    },

    cameraToggleButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },

    cameraToggleText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default DiagnosticScreen;
