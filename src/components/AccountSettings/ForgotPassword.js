// ForgotPasswordScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../firebase";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const auth = FIREBASE_AUTH;

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccessMessage("Password reset email sent!");
        setEmail("");
        
        setTimeout(() => {
          setSuccessMessage(null);
          navigation.navigate("LoginScreen");
        }, 3000);

        
      })
      .catch((error) => {
        setErrorMessage("Invalid email");
        setTimeout(() => {
          setErrorMessage(null);
          console.log("DEBUG: Error sending password reset email:", error);
        }, 3000);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
        
        <View style={styles.container}>
            <View style={{ alignItems: "center", alignSelf: "center" }}>
                <Text style={styles.headerText}>Forgot Password</Text>
            </View>

            <View style={styles.container}>

                <Text style={styles.emailTitle}>Input your email below:</Text>

                {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                    <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 34,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',

    ...Platform.select({
        ios: {
            marginHorizontal: 15,
        },
        android: {
            marginHorizontal: 3,
        }
    }),
},
  emailTitle: {
    fontSize: 28,
    fontFamily: "Sofia-Sans",
    color: "#535353",
    textAlign: "center",
    marginBottom: 10,
    width: "100%",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: 244,
    height: 82,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    alignSelf: "center",
    marginBottom: 20,
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
  },
  
  button: {
    width: "100%",
    backgroundColor: "#D4CCDD",
    borderRadius: 14,
    borderColor: "#9464BB",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  }, // End of buttons

  buttonText: {
    fontSize: 24,
    fontFamily: "Sofia-Sans",
    color: "#9464BB",
    textAlign: "center",
    padding: 20,
  }, // End of buttonText
  errorMessage: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
    alignSelf: "center",
    fontFamily: "Sofia-Sans",
    fontSize: 18,
  },
  successMessage: {
    color: "green",
    marginBottom: 20,
    textAlign: "center",
    alignSelf: "center",
    fontFamily: "Sofia-Sans",
    fontSize: 18,
  },
});

export default ForgotPasswordScreen;
