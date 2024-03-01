import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Routine = ({ route }) => {
    const navigation = useNavigation();
    const routineData = route.params;
    const routineName = routineData.routineName;

    console.log('DEBUG: Passed Data:', route);

    // Log the navigation state whenever the component gains focus

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../../../assets/icons/close.png')} style={styles.closeButtonImage} />
                </TouchableOpacity>
                <Text style={styles.title}>{routineName}</Text>
            </View>
        </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        width: "100%",
    }, // End of container

    title: {
        fontSize: 32,
        fontFamily: "Sofia-Sans",
        textAlign: "left",
        marginTop: 20,
        marginLeft: 20,
    }, // End of title

    closeButton: {
        position: 'absolute',
        top: 25,
        right: 20,
        marginRight: 10,
        zIndex: 999,
    }, // End of closeButton

});

export default Routine;
