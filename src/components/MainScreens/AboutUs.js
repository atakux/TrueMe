import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import { useAuth } from '../../utils/AuthContext';

const AboutUsScreen = () => {
    const navigation = useNavigation();
    const user = useAuth();

    const data = [
        { title: 'Angela DeLeo', image: require('../../../assets/images/angela.jpg'), description: 'Software Engineer | CSUF' },
        { title: 'Roman Saddi', image: require('../../../assets/images/roman.jpg'), description: 'Software Engineer | CSUF' },
    ];

    const [pressedItem, setPressedItem] = useState(null);

    const handleEmailPress = (item) => {
        if (item.title === 'Angela DeLeo') {
            // Handle email press for Angela DeLeo
            const email = 'rockyangela5@gmail.com';
            Linking.openURL(`mailto:${email}`);
        } else if (item.title === 'Roman Saddi') {
            // Handle email press for Roman Saddi
            const email = 'romansaddi@gmail.com';
            Linking.openURL(`mailto:${email}`);
        }
    };
    
    const handleLinkedinPress = (item) => {
        if (item.title === 'Angela DeLeo') {
            // Handle LinkedIn press for Angela DeLeo
            const linkedinUsername = 'xatakux';
            Linking.openURL(`https://www.linkedin.com/in/${linkedinUsername}`);
        } else if (item.title === 'Roman Saddi') {
            // Handle LinkedIn press for Roman Saddi
            const linkedinUsername = 'roman-saddi';
            Linking.openURL(`https://www.linkedin.com/in/${linkedinUsername}`);
        }
    };
    
    const handlePortfolioPress = (item) => {
        if (item.title === 'Angela DeLeo') {
            // Handle portfolio press for Angela DeLeo
            const portfolioUrl = 'https://atakux.github.io/';
            Linking.openURL(portfolioUrl);
        } else if (item.title === 'Roman Saddi') {
            // Handle portfolio press for Roman Saddi
            const portfolioUrl = 'https://github.com/RomanSaddiJr';
            Linking.openURL(portfolioUrl);
        }
    };
    
    const handleButtonPress = (item, buttonType) => {
        // Handle button press based on type
        if (buttonType === 'Email') {
            handleEmailPress(item);
        } else if (buttonType === 'Linkedin') {
            handleLinkedinPress(item);
        } else if (buttonType === 'Portfolio') {
            handlePortfolioPress(item);
        }
        setPressedItem(item);
    };

    const renderItem = ({ item }) => (
        <View style={styles.slide}>

            <View style={styles.content}>
            
                <View style={[styles.content, {flexDirection: 'row'}]}>
                    <Text style={[styles.name]}>{item.title}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
            </View>


            <View style={[styles.content, {flexDirection: 'row'}]}>
                <Image source={item.image} style={styles.image} />
                <View style={[styles.content, { marginTop: 10 , width: '50%'}]}>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress(item, 'Email')}>
                            <Text style={styles.buttonText}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress(item, 'Linkedin')}>
                            <Text style={styles.buttonText}>LinkedIn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress(item, 'Portfolio')}>
                            <Text style={styles.buttonText}>Portfolio</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>



            {pressedItem === item && <Text style={styles.title}>{item.title}</Text>}
        </View>
    );
    

    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]}>
            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../../../assets/icons/back.png')} style={styles.backIcon} />
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
                <View style={[styles.container, { paddingBottom: 100 }]}>
                    <Text style={[styles.description, { borderWidth: 1, borderColor: '#64BBA1', padding: 10, borderRadius: 10, justifyContent: 'center', backgroundColor: '#D0F2DA', color: '#64BBA1', }]}>
                        Hey {user.displayName}, nice to meet you! {"\n\n"}
                        I am TrueMe, an AI skincare companion created to help users keep their skin looking healthy. {"\n\n"}
                        We were developed by two undergraduate students at California State University, Fullerton. {"\n\n"}
                        The goal of this project is to help users keep their skin looking healthy using the power of AI.
                    </Text>

                    <View style={[styles.container, { marginTop: 15, alignItems: 'center' }]}>
                        <Text style={styles.title}>Meet The Developers</Text>
                    </View>

                    <View style={[styles.container, { marginTop: 10, alignItems: 'center' }]}>
                        <Carousel
                            data={data}
                            renderItem={renderItem}
                            sliderWidth={400}
                            itemWidth={350}
                            // loop={false} // Make the carousel infinite
                            // autoplay={true}
                            // autoplayDelay={500}
                            // autoplayInterval={2000}
                        />
                    </View>
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
    },
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
    slide: {
        backgroundColor: 'white',
        padding: 20,
        marginBottom: 20,
        width: '100%',
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    content: {
        flexDirection: 'column',
        marginBottom: 10,
    },
    cardDescription: {
        fontSize: 14,
        marginLeft: 10,
        fontFamily: 'Sofia-Sans',
    },
    button: {
        backgroundColor: '#D0F2DA',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        width: '95%',
        marginLeft: '5%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#64BBA1',
        fontWeight: 'bold',
    },
    name : {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'Sofia-Sans',
    },
});

export default AboutUsScreen;
