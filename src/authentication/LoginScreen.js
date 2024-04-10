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
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { loadFonts } from '../utils/FontLoader'; 
import { FIREBASE_AUTH } from "../../firebase";
import { PasswordInputLogin } from '../utils/PasswordInput';


const dismissKeyboard = () => {
  Keyboard.dismiss();
};

const LoginScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState([]);

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

  const handleLogIn = async () => {
    setLoading(true);
    try {

      // Reset all error messages
      setErrors([]);
      
      // Validate user input
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.toLowerCase())) {
        setErrors((prevErrors) => [...prevErrors, "Please enter a valid email"]);
        setLoading(false);
        return;
      }

      if (password === "") {
        setErrors((prevErrors) => [...prevErrors, "Please enter a password"]);
        setLoading(false);
        return;
      }

      // Sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("DEBUG: Signed in with:", user.displayName);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setLoading(false);

      navigation.navigate("AppLoading");

    } catch (error) {
      console.log(error);
      setLoading(false);

      // Handle specific errors
      // If user does not exist, add error message
      if (error.code === "auth/invalid-credential") {
        setErrors((prevErrors) => [...prevErrors, "Incorrect email or password"]);
        setLoading(false);
      } else if (error.code === "auth/too-many-requests") {
        setErrors((prevErrors) => [...prevErrors, "Too many log in attempts, please try again later"]);
        setLoading(false);
      } else {
        setErrors((prevErrors) => [...prevErrors, "An error signing in occurred"]);
        setLoading(false);
        console.log("A general error occurred during sign in: ", error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.mainContainer}>
        {/* Title */}
        <View style={{ alignItems: "center", marginTop: 50 }}>
          {/* Title */}
          <Text style={styles.trueMeTitle}>{"TrueMe"}</Text>
        </View>

        {/* Login fields */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>{"Log in"}</Text>

          {/* Error Message */}
          {errors.map((error, index) => (
              <Text key={index} style={styles.errorMessage}>
                  {" ▸ " + error}
              </Text>
          ))}

          {/* Email input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
          />

          {/* Password input */}
          <PasswordInputLogin value={password} onChangeText={setPassword} />

          {/* Login button */}
          {/* Loading indicator */}
          { loading ? <ActivityIndicator size="large" color="#329376" style={{ marginTop: 20, alignSelf: "center" }} /> 
          : <> 
              <TouchableOpacity
              style={styles.buttons}
              onPress={() => {
                  console.log("DEBUG: Login button pressed with email:", email);

                  // retrieves user data from Firebase 
                  //   => navigates to home screen if their inputted login info matches database info
                  handleLogIn();
              }}
              >
              <Text style={styles.buttonText}>{"Log in"}</Text>
              </TouchableOpacity>
          </>}
        </View>

        {/* Don't have an account? */}
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text style={styles.textButtonInfo}>Don't have an account yet?</Text>

          {/* Navigate to sign up page for user to sign up */}
          <TouchableOpacity
              style={styles.textButton}
              onPress={() => {
                  navigation.navigate('SignupScreen');
              }}>
              <Text style={styles.textButton}>Sign up!</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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

  loginContainer: {
    backgroundColor: "#EDEEF3",
    width: 328,
    height: 415,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.19)",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignSelf: "center",
    padding: 20,
    margin: 20,
  }, // End of loginContainer

  input: {
    width: 244,
    height: 82,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    alignSelf: "center",
    marginBottom: 20,
    fontFamily: "Sofia-Sans",
    fontSize: 32,
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
  },
  

  trueMeTitle: {
    fontSize: 64,
    fontFamily: "Spirax-Regular",
    color: "#804295",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 15,
  }, // End of trueMeTitle

  mainText: {
    fontSize: 24,
    fontFamily: "Sofia-Sans",
    color: "#000000",
    textAlign: "center",
  }, // End of mainText

  loginTitle: {
    fontSize: 32,
    fontFamily: "Sofia-Sans",
    color: "#535353",
    textAlign: "center",
    marginBottom: 10,
  }, // End of loginTitle

  errorMessage: {
    fontSize: 16,
    fontFamily: "Sofia-Sans",
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  }, // End of errorMessage

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
    fontSize: 28,
    fontFamily: "Sofia-Sans",
    color: "#64BBA1",
    textAlign: "center",
  }, // End of buttonText
});

export default LoginScreen;
