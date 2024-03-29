import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

import { loadFonts } from '../utils/FontLoader'; 
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebase";
import { PasswordInputSignup } from '../utils/PasswordInput';

const dismissKeyboard = () => {
  Keyboard.dismiss();
};

const SignupScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfPassword] = useState("");

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

  // Handles main sign up logic: sends data to Firebase
  const handleSignUp = async () => {
    setLoading(true);

    // Reset all error messages
    setErrors([]);

    try {

      // Validate user input
      if (username === "") {
        setErrors((prevErrors) => [...prevErrors, "Please enter a username"]);
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.toLowerCase())) {
        setErrors((prevErrors) => [...prevErrors, "Please enter a valid email"]);
        setLoading(false);
        return;
      }

      else if (password.length < 6) {
        setErrors((prevErrors) => [...prevErrors, "Password must be at least 6 characters long"]);
        setLoading(false);
        return;
      }
      if (confirmPassword === "") {
        setErrors((prevErrors) => [...prevErrors, "Please confirm your password"]);
        setLoading(false);
        return;
      }
      if (confirmPassword !== password) {
        setErrors((prevErrors) => [...prevErrors, "Passwords do not match"]);
        setLoading(false);
        return;
      }

      // Continue with SignUp logic

      // Create a user in Firebase 
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Update user profile to include username
      await updateProfile(user, {
          displayName: username,
      });

      await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
        id: user.uid,
        username: username,
        email: email,
      });

      const routineRef = collection(FIRESTORE_DB, "users", user.uid, "routines");
      const routineDocRef = doc(routineRef, "0");
      await setDoc(routineDocRef, {
        title: "Add Routine",
        days: [0, 1, 2, 3, 4, 5, 6],
        steps: [],
      });

      // Debug
      console.log("DEBUG: Registered with:", user.displayName);
      setLoading(false);

      // Navigate to HomeScreen
      navigation.navigate("HomeScreen");

    } catch (error) {
      // Debug
      console.log("DEBUG:", error);
      setLoading(false);

      // Handle specific errors
      if (error.code === "auth/email-already-in-use") {
        setErrors((prevErrors) => [...prevErrors, "Email already in use"]);
        setLoading(false);
      } else {
        setErrors((prevErrors) => [...prevErrors, "An unknown error occurred"]);
        setLoading(false);
        console.log("General Error during sign up:", error)
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.mainContainer}>
        {/* Title */}
        <View style={{ alignItems: "center"}}>
          {/* Title */}
          <Text style={styles.trueMeTitle}>{"TrueMe"}</Text>
        </View>

        {/* Sign up fields 
            => Displays error messages dynamically
        */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupTitle}>{"Sign up"}</Text>

          {/* Error Message */}
          {errors.map((error, index) => (
              <Text key={index} style={styles.errorMessage}>
                  {" ▸ " + error}
              </Text>
          ))}

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
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())} // update email
          />

          {/* Password input */}
          <PasswordInputSignup value={password} onChangeText={setPassword} placeholder={"Password"}/>

          {/* Confirm password input */}
          <PasswordInputSignup value={confirmPassword} onChangeText={setConfPassword} placeholder={"Confirm password"}/>

          {/* Sign up button */}
          {/* Loading indicator */}
          { loading ? <ActivityIndicator size="large" color="#329376" style={{ marginTop: 20, alignSelf: "center" }} /> 
          : <> 
              <TouchableOpacity
              style={styles.buttons}
              onPress={() => {
                  
                  if (password === confirmPassword) {
                      // store user data to Firebase 
                      //   => navigate to home screen after storing to database
                      handleSignUp();
                  } else {
                      setErrors((prevErrors) => ["Passwords do not match"]);
                      setLoading(false);
                      console.log("DEBUG: Passwords do not match");
                  }
              }}
              >
              <Text style={styles.buttonText}>{"Sign up"}</Text>
              </TouchableOpacity>
          </>}
        </View>

        {/* Have an account? */}
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={styles.textButtonInfo}>Already have an account?</Text>

          {/* Navigate to login page for user to login */}
          <TouchableOpacity
              style={styles.textButton}
              onPress={() => {
                  navigation.navigate('LoginScreen');
              }}>
              <Text style={styles.textButton}>Log in!</Text>
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

  signupContainer: {
    backgroundColor: "#EDEEF3",
    width: 355,
    height: 575,
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
    height: 85,
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

  errorMessage: {
    fontSize: 16,
    fontFamily: "Sofia-Sans",
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  }, // End of errorMessage

  signupTitle: {
    fontSize: 30,
    fontFamily: "Sofia-Sans",
    color: "#535353",
    textAlign: "center",
    marginBottom: 10,
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
    fontSize: 28,
    fontFamily: "Sofia-Sans",
    color: "#64BBA1",
    textAlign: "center",
  }, // End of buttonText
});

export default SignupScreen;
