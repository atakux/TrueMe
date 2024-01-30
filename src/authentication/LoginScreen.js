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
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";

const LoginScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("Signed in with:", user.displayName);

      setLoading(false);

      navigation.navigate("HomeScreen");

    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // Should keep user logged into account
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authUser) => {
          if (authUser) {
            setUser(authUser);
            // Save user information to local storage for the most recent session
            await AsyncStorage.setItem('recentSessionUser', JSON.stringify(authUser));
          } else {
            setUser(null);
          }
        });
    
        // Cleanup the observer when the component unmounts
        return () => unsubscribe();
    }, []);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Title */}
      <View style={{ alignItems: "center", marginTop: 50 }}>
        {/* Title */}
        <Text style={styles.trueMeTitle}>{"TrueMe"}</Text>
      </View>

      {/* Login fields 
            TODO: require fields to be not empty, if empty show error
            TODO: retrieve data from database
      */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>{"Log in"}</Text>

        {/* Spacer */}
        <View style={{ height: 30 }} />

        {/* Email input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
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
            console.log(
              "Login button pressed with email:",
              email,
              "and password:",
              password
            );

            // TODO: retrieve user data from Firebase 
            //       navigate to home screen if their inputted login info matches database info
            navigation.navigate('HomeScreen');
          }}
        >
          <Text style={styles.buttonText}>{"Log in"}</Text>
        </TouchableOpacity>
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
    height: 424,
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
  }, // End of loginTitle

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

export default LoginScreen;
