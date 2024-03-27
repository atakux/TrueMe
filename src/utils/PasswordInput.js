import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Platform } from "react-native";

export const PasswordInputLogin = ({ value, onChangeText }) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
  
    const toggleSecureEntry = () => {
      setSecureTextEntry(prevState => !prevState);
    };
  
    return (
      <View style={{alignSelf: "center"}}>
        <TextInput
          style={styles.loginInput}
          placeholder="Password"
          value={value}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={toggleSecureEntry} style={{position: 'absolute', right: 15, top: 27}}>
          <Image source={secureTextEntry ? require('../../assets/icons/eye-close.png') : require('../../assets/icons/eye-open.png')}/>
        </TouchableOpacity>
      </View>
    );
  };

export const PasswordInputSignup = ({ value, onChangeText, placeholder }) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
  
    const toggleSecureEntry = () => {
      setSecureTextEntry(prevState => !prevState);
    };
  
    return (
      <View style={{alignSelf: "center"}}>
        <TextInput
          style={styles.signupInput}
          placeholder={placeholder}
          value={value}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={toggleSecureEntry} style={{position: 'absolute', right: 15, top: 27}}>
          <Image source={secureTextEntry ? require('../../assets/icons/eye-close.png') : require('../../assets/icons/eye-open.png')}/>
        </TouchableOpacity>
      </View>
    );
};

export const EditPasswordInput = ({ value, onChangeText, placeholder }) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
  
    const toggleSecureEntry = () => {
      setSecureTextEntry(prevState => !prevState);
    };
  
    return (
      <View style={{alignSelf: "center"}}>
        <TextInput
          style={styles.editPWInput}
          placeholder={placeholder}
          value={value}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={toggleSecureEntry} style={{position: 'absolute', right: 10, top: 15}}>
          <Image source={secureTextEntry ? require('../../assets/icons/eye-close.png') : require('../../assets/icons/eye-open.png')}/>
        </TouchableOpacity>
      </View>
    );
};


styles = StyleSheet.create({
    loginInput: {
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
    signupInput: {
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
    }, 
    editPWInput: {
        fontFamily: 'Sofia-Sans',
        color: '#000000',
        textAlign: "left",
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#64BBA1",
        padding: 5,
        paddingLeft: 10,

        ...Platform.select({
            ios: {
                fontSize: 20,
                width: 290,
                height: 50,
            },
            android: {
                fontSize: 18,
                width: 300,
                height: 50,
            },
        }),
    }, // End of inputText
});