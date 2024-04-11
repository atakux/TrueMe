import React from 'react';
import { View, Text, ScrollView,TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AboutUsScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]}>

            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../../../assets/icons/back.png')} style={styles.backIcon}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../../../assets/icons/home-fill.png')} />
                </TouchableOpacity>
                <Text style={[styles.heading, { bottom: 55 }]}>About Us</Text>
            </View>

        <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            showsVerticalScrollIndicator={false}
        >

            <View style={[styles.container, { paddingBottom: 300 }]}>
                <Text style={[styles.description, {borderWidth: 1, borderColor:'#64BBA1', padding: 10, borderRadius: 10, justifyContent: 'center', backgroundColor: '#D0F2DA', color: '#64BBA1',}]}>
                    Hello username, nice to meet you! {"\n\n"}
                    I am TrueMe, an AI skincare companion created to help users keep their skin looking healthy. {"\n\n"}
                    We were developed by two undergraduate students at California State University, Fullerton. {"\n\n"}
                    The goal of this project is to help users keep their skin looking healthy using the power of AI.
                </Text>

                
                <Text style={[styles.description , { marginTop: 50 }]}>
                    Developer 1: Angela Deleo {"\n\n"}
                    Hello! My name is Angela and I am a graduating undergraduate student of CS and minor in Mathematics at California State University, Fullerton. {"\n\n"}
                    
                    
                    
                    {"\n\n\n\n\n"}
                </Text>

                <Text style={styles.description}>
                    Developer 2: Roman Saddi {"\n\n"}
                    Hello! My name is Roman and I am a graduating senior at California State University, Fullerton. {"\n\n"}
                </Text>
            </View>
        </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    topContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 10,
        height: 100,
        },

    scrollViewContainer: {
        flexGrow: 1,
        padding: 20,
        },

    container: {
        width: "100%",
        alignSelf: 'center',
        }, // End of container

    backButton: {
        alignSelf: 'flex-start',
        paddingLeft: 15,
        paddingTop: 10,
    },
    homeButton: {
        alignSelf: 'flex-end',
        paddingRight: 15,
        bottom: 30,
    },
    backIcon: {
        width: 30,
        height: 30,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'Sofia-Sans',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Sofia-Sans',
    },
    });

    export default AboutUsScreen;
