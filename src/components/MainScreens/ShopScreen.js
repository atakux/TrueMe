import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, TextInput, ScrollView, Animated, Platform, Modal, Button, Linking,TouchableWithoutFeedback } from 'react-native';
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
  const [searchQuery, setSearchQuery] = useState(''); // State to manage search query
  const axios = require('axios');
  const [visibleProducts, setVisibleProducts] = useState(10); // State to keep track of the number of products displayed
  const [modalVisible, setModalVisible] = useState({ visible: false, product: null });
  
  
  const scrollY = useRef(new Animated.Value(0)).current;
  

  // Fetch data from API
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

  // Load fonts and check user authentication
  useEffect(() => {
    const loadAsyncData = async () => {
      await loadFonts();
      setFontLoaded(true);
    };

    loadAsyncData();
  }, []);

  // Function to handle button click
  const handleButtonClick = (buttonName) => {
    setActiveTab(buttonName);
  };

  // Function to filter products based on search query
  const filterProducts = (products, query) => {
    return products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Rendered product item
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

  // Interpolated header height
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 400],
    outputRange: [460, 170],
    extrapolate: 'clamp',
  });

  // Interpolated scale
  const scale = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  // Interpolated opacity
  const opacity = scrollY.interpolate({
    inputRange: [0, 400],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Function to handle scrolling to the bottom of the ScrollView
  const handleScrollEnd = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      // If scrolled to the bottom, increment the number of visible products by 10
      setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 10);
    }
  };

  const handleLinkPress = () => {
    if (modalVisible.product && modalVisible.product.url) {
      Linking.openURL(modalVisible.product.url);
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
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
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            onChangeText={(text) => setSearchQuery(text)} // Update searchQuery state with user input
            value={searchQuery} // Bind the value of the TextInput to the state
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>X</Text>
          </TouchableOpacity>
          )}
        </View>
      </Animated.View>
  
  <ScrollView
    onScroll={Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    )}
    onScrollEndDrag={({ nativeEvent }) => handleScrollEnd(nativeEvent)}
    scrollEventThrottle={16}
  >
        {activeTab === 'Button 1' && (
          <View style={styles.tabContentContainer}>
            {filterProducts(skincareProducts, searchQuery).slice(0, visibleProducts).map(product => (
              <View key={product.asin} style={styles.productContainer}>
                <ProductItem imageUrl={product.image} />

                <TouchableOpacity onPress={() => setModalVisible({ visible: true, product })}>
                  <View style={styles.productTextContainer}>
                    <Text style={styles.productTitle}>{product.title.length > 80 ? `${product.title.substring(0, 80)}...` : product.title}{'\n'}</Text>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <Text style={styles.productRating}>Rating: {product.stars}</Text>
                  </View>
                </TouchableOpacity>

                
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Button 2' && (
          <View style={styles.tabContentContainer}>
            {filterProducts(makeupProducts, searchQuery).slice(0, visibleProducts).map(product => (
              <View key={product.asin} style={styles.productContainer}>
                <ProductItem imageUrl={product.image} />


                <TouchableOpacity onPress={() => setModalVisible({ visible: true, product })}>

                  <View style={styles.productTextContainer}>
                    <Text style={styles.productTitle}>{product.title.length > 80 ? `${product.title.substring(0, 80)}...` : product.title}{'\n'}</Text>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <Text style={styles.productRating}>Rating: {product.stars}</Text>
                  </View>

                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible.visible}
      onRequestClose={() => setModalVisible({ visible: false, product: null })}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible({ visible: false, product: null })}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {modalVisible.product && (
              <TouchableOpacity onPress={handleLinkPress}>
                <Text style={{ color: 'blue' }}>{modalVisible.product.url}</Text>
              </TouchableOpacity>
            )}
            <Button title="Close Modal" onPress={() => setModalVisible({ visible: false, product: null })} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>


    </View>

    
  );
};



// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingTop: 50,
    paddingBottom: 50,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Sofia-Sans',
    color: '#000000',
  },
  mainText: {
    ...this.text,
    fontSize: 18,
    textAlign: "center",
  },
  titleText: {
    ...this.text,
    fontSize: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    ...this.text,
    fontSize: 32,
    color: '#64BBA1',
    textAlign: "center",
  },
  imageContainer: {
    alignItems: 'center',
    height: 300,
    width: '100%',
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
    ...this.text,
    fontSize: 32,
    color: '#64BBA1',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 60,
    marginHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: 'black',
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 18,
    ...this.text,
  },
  tabContentContainer: {
    ...Platform.select({
      ios: {
        minHeight: 375,
        paddingBottom: 75,
        marginTop: 10,
        overflow: 'scroll',
      },
    }),
    
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 10,
    marginLeft: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    width: "96%",
    height: 200,
  },
  productTextContainer: {
    flex: 1,
    marginLeft: 10,
    marginTop: 30,
    width: 225,
  },
  productimage: {
    width: 125,
    height: 125,
    resizeMode: 'contain',
    marginLeft: 10,
    marginTop: 10,
  },
  productTitle: {
    fontSize: 16,
    ...this.text,
    fontWeight: 'bold',
  },
  activeTab: {
    backgroundColor: 'lightgray',
  },
  activeTabText: {
    color: 'black',
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

  clearButton: {
    position: 'absolute',
    right: 25,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#333', // Change the color of the X icon
    fontSize: 20, // Adjust the font size of the X icon
    fontWeight: 'bold', // Make the X icon bold
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  
  
});

export default ShopScreen;