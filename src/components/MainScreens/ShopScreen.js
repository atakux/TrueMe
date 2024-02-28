import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, getDisplayName } from 'firebase/auth';

import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';

const ShopScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const user = useAuth();
  const [activeTab, setActiveTab] = useState('Button 1'); // Initial active tab

  useEffect(() => {
    const loadAsyncData = async () => {
      await loadFonts();
      setFontLoaded(true);
    };

    loadAsyncData();
  }, []);

  if (!fontLoaded || !user) {
    // Font is still loading or user not logged in, you can return a loading indicator or null
    return null;
  }

  const handleButtonClick = (buttonName) => {
    // Handle button click here
    setActiveTab(buttonName);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView>



        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/shop-backdrop.jpg')} // Change the path to your image
            style={styles.image}
            resizeMode="cover" // You can adjust resizeMode as per your requirement
          />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}> {'\n \n'} Find your next {'\n'}skincare product</Text>
            <Text style={styles.mainText}> Your Skin Profile: </Text>
          </View>
        </View>

      

        <View style={styles.textContainer}>
          <Text style={styles.titleText}> {'\n'}Products For You </Text>
        </View>



        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => handleButtonClick("Button 1")}
            style={[styles.tabButton, activeTab === 'Button 1' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'Button 1' && styles.activeTabText]}>Skincare</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleButtonClick("Button 2")}
            style={[styles.tabButton, activeTab === 'Button 2' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'Button 2' && styles.activeTabText]}>Makeup</Text>
          </TouchableOpacity>
          {/* Add more tabs as needed */}
        </View>




        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            onChangeText={(text) => console.log(text)} // Handle text change
          />
        </View>




        {/* Render content based on active tab */}
        {activeTab === 'Button 1' && <View style={styles.tabContent}><Text>Skincare Products go Here</Text></View>}
        {activeTab === 'Button 2' && <View style={styles.tabContent}><Text>Makeup Products go Here</Text></View>}



      </SafeAreaView>
    </ScrollView>
  );
};

// Styles

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FAFAFA",
    alignItems: 'center',
  }, // End of container

  mainText: {
    fontSize: 18,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "center",
  }, // End of mainText

  titleText: {
    fontSize: 32,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    textAlign: "center",
  }, // End of mainText

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

  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },

  buttonText: {
    fontSize: 32,
    fontFamily: 'Sofia-Sans',
    color: '#64BBA1',
    textAlign: "center",
  }, // End of buttonText

  imageContainer: {
    alignItems: 'center',
    height: 300, // Adjust the height of the image container as per your image size
    width: 415,
  },

  image: {
    flex: 1,
    width: '95%',
    height: '90%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },

  overlayText: {
    fontSize: 32,
    fontFamily: 'Sofia-Sans',
    color: '#64BBA1',
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },

  tabText: {
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Sofia-Sans',
  },

  activeTab: {
    backgroundColor: 'lightgray',
  },

  activeTabText: {
    color: 'black',
  },

  tabContent: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginTop: 10,
  },

  searchContainer: {
    paddingHorizontal: 15,
    marginTop: 0,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontWeight: 'bold',
  },
});

export default ShopScreen;
