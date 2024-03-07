import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';

const DiagnosticScreen = () => {
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
                <Text style={styles.title}>Skin Diagnostic Test</Text>
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
        marginTop: 200,
        alignSelf: 'center',
    },

    buttonContainer: {
        marginTop: 50,
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

        ...Platform.select({
            ios: {
                marginHorizontal: 50,
            },
            android: {
                marginHorizontal: 30,
            }
        }),
    },
});

export default DiagnosticScreen;