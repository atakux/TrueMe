import React from 'react';
import { View, Text, ScrollView,TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';

const AboutUsScreen = () => {
    const navigation = useNavigation();


    const data = [
        { title: 'Angela Deleo',
         image: require('../../../assets/images/angela.jpg'),
        description: 'Software Engineer | CSUF \n\nEmail: \nrockyangela5@gmail.com \n\nPhone: \n(310) 896-6733'},

        { title: 'Roman Saddi',
        image: require('../../../assets/images/roman.jpg'),
        description: 'Software Engineer | CSUF \n\nEmail: \nRomansaddi@gmail.com \n\nPhone: \n(310) 971-0491' },
    ];
    
    const renderItem = ({ item }) => (
        <View style={styles.slide}>
        <View style={styles.content}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
        </View>
    );

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

            <View style={[styles.container, { paddingBottom: 100 }]}>
                <Text style={[styles.description, {borderWidth: 1, borderColor:'#64BBA1', padding: 10, borderRadius: 10, justifyContent: 'center', backgroundColor: '#D0F2DA', color: '#64BBA1',}]}>
                    Hello username, nice to meet you! {"\n\n"}
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
    slide: {
        backgroundColor: '#f0f0f0',
        borderRadius: 1,
        borderColor: 'black',
        padding: 20,
        borderWidth: 1, 
        borderRadius: 10, 
        width: '100%',

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
    },
    content: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    cardDescription: {
        fontSize: 14,
        marginLeft: 10,
        fontFamily: 'Sofia-Sans',
    },
    });

    export default AboutUsScreen;





