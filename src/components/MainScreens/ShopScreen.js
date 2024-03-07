import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, TextInput, ScrollView, Animated, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, getDisplayName } from 'firebase/auth';

import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';

import fetchAmazonProductData from '../../utils/API/amazonAPI';


const ShopScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const user = useAuth();
  const [activeTab, setActiveTab] = useState('Button 1'); // Initial active tab
  const [skincareProducts, setSkincareProducts] = useState([]); // State to store fetched skincare products
  const [makeupProducts, setMakeupProducts] = useState([]); // State to store fetched makeup products
  const axios = require('axios');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  

//////////////////////////////////////////////////////////////
// BE CAREFUL WITH THIS, API COSTS MONEY, DO NOT LOOP, TURN OFF WHEN NOT NEEDED FOR TESTING

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAmazonProductData("Skincare");
        setSkincareProducts(data.data); // Update state with fetched data

        const data1 = await fetchAmazonProductData("Makeup");
        setMakeupProducts(data1.data); // Update state with fetched data

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

/////////////////////////////////////////////////////////////


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

  const ProductItem = ({ imageUrl }) => {
    return (
      <View style={styles.productItemContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.productimage}
        />
      </View>
    );
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 400], // Change 200 to the height you want your header to collapse to
    outputRange: [460, 170], // Change 50 to the collapsed height of the header
    extrapolate: 'clamp',
  });
  

  const scale = scrollY.interpolate({
    inputRange: [0, 300], // Change 200 to the height at which you want the animation to complete
    outputRange: [1, 0.5], // Initial scale: 1, Scale to: 0.5
    extrapolate: 'clamp', // Clamp values to avoid going beyond specified input range
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, 300], // Change 200 to the height at which you want the animation to complete
    outputRange: [1, 0], // Initial opacity: 1, Opacity to: 0
    extrapolate: 'clamp', // Clamp values to avoid going beyond specified input range
  });

  return (

  <View style={{ flex: 1 }}>


    {/* <Animated.View style={{ height: headerHeight, justifyContent: 'center', alignItems: 'center' }}> */}
      

      <View style={{flex: 1, paddingTop: 50}}>
        <Animated.View style={[styles.imageContainer, { transform: [{ scale }], opacity }]}>
          <Image
            source={require('../../../assets/images/shop-backdrop.jpg')}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}> {'\n \n'} Find your next {'\n'}skincare product</Text>
            <Text style={styles.mainText}> Your Skin Profile: </Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={{ height: headerHeight, justifyContent: 'flex-end', alignItems: 'center'}}>

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



    </Animated.View>
  
    <ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >


        {activeTab === 'Button 1' && (
          <View style={styles.tabContentContainer}>
            {skincareProducts.slice(0, 10).map(product => (
              <View key={product.asin} style={styles.productContainer}>

                <ProductItem imageUrl={product.image} />

                <View style={styles.productTextContainer}>
                  <Text style={styles.productTitle}>{product.title.length > 80 ? `${product.title.substring(0, 80)}...` : product.title}{'\n'}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <Text style={styles.productRating}>Rating: {product.stars}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {activeTab === 'Button 2' && (
          <View style={styles.tabContentContainer}>
            {makeupProducts.slice(0, 10).map(product => (
              <View key={product.asin} style={styles.productContainer}>

                <ProductItem imageUrl={product.image} />

                <View style={styles.productTextContainer}>
                  <Text style={styles.productTitle}>{product.title.length > 80 ? `${product.title.substring(0, 80)}...` : product.title}{'\n'}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <Text style={styles.productRating}>Rating: {product.stars}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* {activeTab === 'Button 1' && <View style={styles.tabContent}><Text>Skincare Products go Here</Text></View>} */}
        {/* {activeTab === 'Button 2' && <View style={styles.tabContent}><Text>Makeup Products go Here</Text></View>} */}

    </ScrollView>
  </View>
  );
};







// Styles

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FAFAFA",
    alignItems: 'center',
    paddingBottom: 50,
    paddingTop: 50,
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

  tabContentContainer: {
    minHeight: 375,
    paddingBottom: 75,
    marginTop: 10,
    overflow: 'scroll',
  },

  productContainer: {
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center', // Vertically center the items
    backgroundColor: '#ffffff',
    marginBottom: 10,
    marginLeft: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    width: 400,
    height: 200,
  },

  productItemContainer: {
    alignItems: 'left',
  },

  productTextContainer: {
    flex: 1, // Take remaining space
    marginLeft: 10, // Add some spacing between the image and text
  },

  productimage: {
    width: 125,
    height: 125,
    resizeMode: 'contain',
  },

  productTitle: {
    fontSize: 18,
    fontFamily: 'Sofia-Sans',
    color: '#000000',
    fontWeight: 'bold',
  },

  activeTab: {
    backgroundColor: 'lightgray',
  },

  activeTabText: {
    color: 'black',
  },

  tabContent: {
    minHeight: 3000 , // Set the height to your desired fixed size
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginTop: 10,
    overflow: 'scroll', // Enable scrolling if content exceeds container size
  },

  searchContainer: {
    paddingHorizontal: 15,
    marginTop: 0,
    marginBottom: 10,
    width: 400,
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
