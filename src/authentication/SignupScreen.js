import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";

import { useNavigation } from '@react-navigation/native';

import * as Font from "expo-font";

import { loadFonts } from '../utils/FontLoader'; 
import { FIREBASE_AUTH } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firestore } from "firebase/firestore";

const SignupScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfPassword] = useState("");

  useEffect(() => {
    const loadAsyncData = async () => {
      await loadFonts();
      setFontLoaded(true);
    };

    loadAsyncData();
  }, []);

  if (!fontLoaded) {
    // Font is still loading, you can return a loading indicator or null
    return null;
  }

  const handleSignUp = async () => {
    setLoading(true);
    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      console.log("Registered with:", user);
      setLoading(false);

      navigation.navigate("HomeScreen");

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Title */}
      <View style={{ alignItems: "center"}}>
        {/* Title */}
        <Text style={styles.trueMeTitle}>{"TrueMe"}</Text>
      </View>

      {/* Login fields 
            TODO: require fields to be not empty, if empty show error
            TODO: store data into database
      */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupTitle}>{"Sign up"}</Text>

        {/* Spacer */}
        <View style={{ height: 15 }} />

        {/* Username input */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername} // update username
        />

        {/* Email input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())} // update email
        />

        {/* Password input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword} // update password
        />

        {/* Confirm password input */}
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          autoCapitalize="none"
          value={confirmPassword}
          secureTextEntry={true}
          onChangeText={setConfPassword} // update confirm password
        />

        {/* Login button */}
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            
            if (password === confirmPassword) {
                console.log(
                    "Signup button pressed with email:",
                    email,
                    "and password:",
                    password
                );

                // TODO: store user data to Firebase 
                //       navigate to home screen after storing to database
                handleSignUp();
            } else {
                // TODO: Add error
                console.log("Passwords do not match!");
            }
          }}
        >
          <Text style={styles.buttonText}>{"Sign up"}</Text>
        </TouchableOpacity>
      </View>

      {/* Don't have an account? */}
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={styles.textButtonInfo}>Already have an account?</Text>

        {/* Navigate to sign up page for user to sign up */}
        <TouchableOpacity
            style={styles.textButton}
            onPress={() => {
                navigation.navigate('LoginScreen');
            }}>
            <Text style={styles.textButton}>Log in!</Text>
        </TouchableOpacity>

    </View>
    </SafeAreaView>
  );
};

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: "#D4CCDD",
    width: "100%",
  }, // End of container

  mainContainer: {
    flex: 1,
    backgroundColor: "#E2E1EA",
    width: "100%",
  }, // End of mainContainer

  signupContainer: {
    backgroundColor: "#EDEEF3",
    width: 328,
    height: 570,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.19)",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignSelf: "center",
    padding: 15,

        
  }, // End of signupContainer

  input: {
    width: 289,
    height: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    alignSelf: "center",
    marginBottom: 10,
    fontFamily: "Sofia-Sans",
    fontSize: 24,
    padding: 20,

    // Style depending on iOS vs Android
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOffset: {
          width: 2,
          height: 4,
          
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,

      },
      android: {
        elevation: 5,
      },
    }),
  }, // End of input
  

  trueMeTitle: {
    fontSize: 64,
    fontFamily: "Spirax-Regular",
    color: "#804295",
    textAlign: "center",

    ...Platform.select({
        ios: {
            marginBottom: 20,
            marginTop: 0,
        },

        android: {
            marginBottom: 30,
            marginTop: 55,
        },

    })
  }, // End of trueMeTitle

  mainText: {
    fontSize: 24,
    fontFamily: "Sofia-Sans",
    color: "#000000",
    textAlign: "center",
  }, // End of mainText

  signupTitle: {
    fontSize: 30,
    fontFamily: "Sofia-Sans",
    color: "#535353",
    textAlign: "center",
  }, // End of signupTitle

  textButton: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#212121",
    textAlign: "center",
    textDecorationLine: "underline",
  }, // End of textButton

  textButtonInfo: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#212121",
    textAlign: "center",
  }, // End of textButtonInfo

  buttons: {
    width: 159,
    height: 82,
    backgroundColor: "#D0F2DA",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#7FB876",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  }, // End of buttons

  buttonText: {
    fontSize: 20,
    fontFamily: "Sofia-Sans",
    color: "#212121",
    textAlign: "center",
  }, // End of buttonText
});

export default SignupScreen;
