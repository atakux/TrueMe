import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import * as Font from 'expo-font';

// Load fonts
const LoadFonts = async () => {
  await Font.loadAsync({
    'Spirax-Regular': require('../../assets/fonts/Spirax-Regular.ttf'),
    'Sofia-Sans': require('../../assets/fonts/Sofia-Sans.ttf'),
  });
};

const LoginScreen = () => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const loadAsyncData = async () => {
        await LoadFonts();
        setFontLoaded(true);
        };

        loadAsyncData();
    }, []);

    if (!fontLoaded) {
        // Font is still loading, you can return a loading indicator or null
        return null;
    }

return (
    <SafeAreaView style={styles.mainContainer}>
        { /* Title */ }
        <View style={{alignItems: 'center', marginTop: 50 }}>
            {/* Title */}
            <Text style={styles.trueMeTitle}>
                {"TrueMe"}
            </Text>
        </View>

        { /* Login fields */}
        <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>
                {"Log in"}

                {/* Email input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />

                {/* Password input */}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                />

                {/* Login button */}
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => {
                        // TODO: Add login functionality
                        console.log('Login button pressed with email:', email, 'and password:', password);
                    }}
                >
                    <Text style={styles.buttonText}>
                        {"Log in"}
                    </Text>
                </TouchableOpacity>
            </Text>


        </View>

    </SafeAreaView>
    );
}

// Styles

const styles = StyleSheet.create({
    container: {
      flex: 5,
      backgroundColor: "#D4CCDD",
      width: "100%",
    }, // End of container

    mainContainer: {
      flex: 1,
      backgroundColor: '#E2E1EA',
      width: "100%",
    }, // End of mainContainer

    loginContainer: {
      backgroundColor: '#EDEEF3',
      width: 328,
      height: 424,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: 'rgba(0, 0, 0, 0.19)',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      alignSelf: 'center',
      padding: 20,
      margin: 20
    }, // End of loginContainer

    input: {
        width: 244,
        height: 82,
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 14,
        margin: 50,
        padding: 20,
    },
  
    trueMeTitle: {
      fontSize: 64,
      fontFamily: 'Spirax-Regular',
      color: '#804295',
      textAlign: "center",
      marginBottom: 30,
      marginTop: 15,
    }, // End of trueMeTitle
  
    mainText: {
      fontSize: 24,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "center",
    }, // End of mainText

    loginTitle: {
        fontSize: 32,
        fontFamily: 'Sofia-Sans',
        color: '#535353',
        textAlign: "center",
    }, // End of loginTitle
  
    buttons: {
      width: 159,
      height: 82,
      backgroundColor: '#D0F2DA',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#7FB876',
      justifyContent: 'center',
      alignItems: 'center',
    }, // End of buttons
  
    buttonText: {
      fontSize: 32,
      fontFamily: 'Sofia-Sans',
      color: '#64BBA1',
      textAlign: "center",
    }, // End of buttonText
  
  });
  
  export default LoginScreen;