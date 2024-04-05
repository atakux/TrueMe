import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, Image, Animated, Easing, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';

import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';
import * as FileSystem from 'expo-file-system';

const DiagnosticScreen = () => {
    const navigation = useNavigation();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [capturedPhotoUri, setCapturedPhotoUri] = useState(null);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const cameraRef = useRef(null);
    const glowValue = useRef(new Animated.Value(0)).current;

    // Calculate the height based on the aspect ratio 9:16
    const aspectRatio = 3 / 4;

    // Define styles for the Camera component
    const cameraStyles = StyleSheet.create({
        cameraContainer: {
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            aspectRatio: aspectRatio // This sets the aspect ratio dynamically
        }
    });

    useEffect(() => {
        const loadAsyncData = async () => {
            await loadFonts();
            setFontLoaded(true);
        };

        loadAsyncData();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
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
    
                // Save the photo to the device's cache or file system
                setCapturedPhotoUri(photo.uri); // Set captured photo URI
                setShowModal(true); // Show modal after capturing the photo

            } catch (error) {
                console.error('Error taking photo:', error);
            }
            setIsTakingPhoto(false);
        }
    };

    const handleRetake = () => {
        setCapturedPhotoUri(null); // Reset captured photo URI
        setShowModal(false); // Hide modal
    };

    const handleUsePhoto = () => {
        // Pass the filename to your analysis function
        analyzePhoto(capturedPhotoUri);
        setShowModal(false); // Hide modal
        navigation.navigate('LoadingAnalysis'); // Navigate to the loading screen
    };

    const analyzePhoto = async (filename) => {
        console.log('Analyzing photo:', filename);

        // Import and call analysis function here
        // to access jpg file, use "filename"
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
                    <Camera style={ cameraStyles.cameraContainer } type={cameraType} ref={cameraRef}>
                        {/* Oval image overlay */}
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

                        {/* Dotted outline */}
                        <Image source={require('../../../assets/images/dotted_head_outline.png')}style={styles.overlaydottedImageIn}/>
                        <Image source={require('../../../assets/images/dotted_head_outline.png')}style={styles.overlaydottedImageOut}/>
                    </Camera>
                )}
            </View>

            {/* Overlay Dialogue */}
            <View style={styles.overlayDialogue}>
                <Text style={styles.overlayText}>Line up your face with the frame and take a photo.</Text>
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

            {/* Modal for retake or use photo */}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Image source={{ uri: capturedPhotoUri }} style={styles.modalPhoto} resizeMode="contain" />
                        <Text style={styles.modalText}>Do you want to retake the photo?</Text>
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity style={styles.modalButtonRetake} onPress={handleRetake}>
                                <Text style={styles.modalButtonText}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={handleUsePhoto}>
                                <Text style={styles.modalButtonText}>Use Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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

    overlayImage: {
        width: 400,
        height: 400,
        resizeMode: 'contain',
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: [{ translateX: -200 }, { translateY: -50 }], // Adjust for half of image width
    },
    
    overlaydottedImageIn: {
        width: 600,
        height: 600,
        resizeMode: 'contain',
        position: 'absolute',
        top: '20%',
        left: '50%',
        opacity: 0.3,
        transform: [{ translateX: -303 },  { translateY: -150 }], // Adjust for half of image width
    },
    
    overlaydottedImageOut: {
        width: 700,
        height: 700,
        resizeMode: 'contain',
        position: 'absolute',
        top: '20%',
        left: '50%',
        opacity: 0.3,
        transform: [{ translateX: -354 }, { translateY: -200 }], // Adjust for half of image width
    },

    overlayDialogue: {
        position: 'absolute',
        top: '80%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 1,
        borderRadius: 20,
    },

    overlayText: {
        color: '#fff',
        fontSize: 20,
        padding: 10,
        textAlign: 'left',
        fontFamily: 'Sofia-Sans',
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },

    modalPhoto: {
        width: 200, // Adjust according to your preference
        height: 200, // Adjust according to your preference
        marginBottom: 20,
    },

    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },

    modalButtonsContainer: {
        flexDirection: 'row',
    },

    modalButton: {
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: '#64BBA1',
        borderRadius: 5,
    },

    modalButtonRetake: {
        backgroundColor: '#804396',
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 5,
    },

    modalButtonText: {
        color: '#fff',
        fontFamily: 'Sofia-Sans',
        fontSize: 16,
    },
});

export default DiagnosticScreen;
