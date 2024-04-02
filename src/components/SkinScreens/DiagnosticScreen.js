import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, Animated, Easing } from 'react-native';
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
    const [capturedPhotoUri, setCapturedPhotoUri] = useState(null);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const cameraRef = useRef(null);
    const glowValue = useRef(new Animated.Value(0)).current;

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

    useEffect(() => {
        if (fontLoaded && hasPermission) {
            startGlowAnimation();
        }
    }, [fontLoaded, hasPermission]); // Start animation once font and permission are loaded

    const startGlowAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(glowValue, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const toggleCameraType = () => {
        setCameraType(
            cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    const takePhoto = async () => {
        console.log('Taking photo...');
        if (cameraRef.current && !isTakingPhoto) {
            setIsTakingPhoto(true);
            try {
                const photo = await cameraRef.current.takePictureAsync();
                console.log('Photo captured:', photo);
                setCapturedPhotoUri(photo.uri); // Store the URI of the captured photo
            } catch (error) {
                console.error('Error taking photo:', error);
            }
            setIsTakingPhoto(false);
        }
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
                {capturedPhotoUri ? (
                    <Image source={{ uri: capturedPhotoUri }} style={{ flex: 1 }} resizeMode="contain" />
                ) : (
                    <Camera style={{ flex: 1 }} type={cameraType} ref={cameraRef}>
                        {/* Transparent image overlay */}
                        <Animated.Image
                            source={require('../../../assets/images/head_outline.png')}
                            style={[
                                styles.overlayImage,
                                {
                                    opacity: glowValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.2, 0.8],
                                    }),
                                },
                            ]}
                        />
                    </Camera>
                )}
            </View>

            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={takePhoto} disabled={isTakingPhoto}>
                    <Image source={require('../../../assets/icons/click_camera.png')} style={styles.takePhotoIcon} />
                </TouchableOpacity>
            </View>


            <View style={styles.cameraToggleContainer}>
                <TouchableOpacity onPress={toggleCameraType}>
                    <Image source={require('../../../assets/icons/camera_flip.png')} style={styles.cameraToggleIcon} />
                </TouchableOpacity>
            </View>

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

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1.0)',
        paddingVertical: 12,
    },

    takePhotoIcon: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        // Add any additional styles for the icon here
    },

    takePhotoButtonText: {
        color: '#fff',
        fontSize: 16,
    },

    cameraToggleContainer: {
        position: 'absolute',
        bottom: 0,
        left: "75%",
        right: 0,
        flexDirection: 'row',
        justifyContent: 'right',
        alignItems: 'center',
        paddingVertical: 12,
    },

    cameraToggleIcon: {
        width: 70,
        height: 70,
    },

    cameraToggleText: {
        color: '#fff',
        fontSize: 16,
    },

    overlayImage: {
        width: 450,
        height: 450,
        resizeMode: 'cover',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -225 }, { translateY: -225 }], // Adjust for half of image width and height
    },
});

export default DiagnosticScreen;
