import React, { useEffect, useState, useRef } from 'react';
import { Platform, Keyboard, StyleSheet, View, Text, TouchableOpacity, Image, TextInput, ScrollView, Animated, Modal, ActivityIndicator, Button, Linking,TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';

import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';

import fetchAmazonProductData from '../../utils/API/amazonAPI';

const ShopScreen = ({ setIsTyping }) => {
  const axios = require('axios');
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const user = useAuth();
  const [activeTab, setActiveTab] = useState('Button 1'); // Initial active tab

  const [skincareProducts, setSkincareProducts] = useState([]); // State to store fetched skincare products
  const [makeupProducts, setMakeupProducts] = useState([]); // State to store fetched makeup products

  const [searchQuery, setSearchQuery] = useState(''); // State to manage search query
  const [visibleProducts, setVisibleProducts] = useState(10); // State to keep track of the number of products displayed
  const [modalVisible, setModalVisible] = useState({ visible: false, product: null }); // State to manage modal visibility

  const [loadingSkincare, setLoadingSkincare] = useState(true); // State to track skincare loading state
  const [loadingMakeup, setLoadingMakeup] = useState(true); // State to track makeup loading state
  
  const scrollY = useRef(new Animated.Value(0)).current; // Scroll value for animation
  const scrollViewRef = useRef(null);

  const debouncedSetIsTyping = debounce(setIsTyping, -1000); // Debounce setIsTyping function

  // Function to scroll to top of screen
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };
  
  // Fetch data from Amazon API
  useEffect(() => {
    const fetchData = async () => {
      try {

        const skincareData = await fetchAmazonProductData("Skincare");
        setSkincareProducts(skincareData.data); // Update state with fetched skincare products data
        setLoadingSkincare(false);

        const makeupData = await fetchAmazonProductData("Makeup");
        setMakeupProducts(makeupData.data); // Update state with fetched makeup products data
        setLoadingMakeup(false);

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Remove TabBar when user is typing in search bar
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => debouncedSetIsTyping(true) // Use debounced setIsTyping function
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => debouncedSetIsTyping(false) // Use debounced setIsTyping function
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [debouncedSetIsTyping]);

  // Load fonts and check user authentication
  useEffect(() => {
    const loadAsyncData = async () => {
      await loadFonts();
      setFontLoaded(true);
    };

    loadAsyncData();
  }, []);

  // Function to handle tab button click
  const handleButtonClick = (buttonName) => {
    setActiveTab(buttonName);
    scrollToTop();
  };

  // Function to filter products based on search query
  const filterProducts = (products, query) => {
    return products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Render product image
  const ProductImage = ({ imageUrl }) => {
    return (
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.productimage}
        />
      </View>
    );
  };

  // Functions to handle collapsable header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 400],
    outputRange: [460, 170],
    extrapolate: 'clamp',
  });
  const scale = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });
  const opacity = scrollY.interpolate({
    inputRange: [0, 400],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Function to add more products when scrolled to the bottom
  const handleScrollEnd = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      // If scrolled to the bottom, increment the number of visible products by 10
      setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 10);
    }
  };

  // Function to open product URL
  const handleLinkPress = () => {
    if (modalVisible.product && modalVisible.product.url) {
      Linking.openURL(modalVisible.product.url);
    }
  };

  // Function to generate star rating visuals
  function generateStars(rating) {
    const maxRating = 5;
    const filledStars = Math.floor(rating);
    const emptyStars = maxRating - filledStars;
    let stars = '';
    for (let i = 0; i < filledStars; i++) {
        stars += '★'; // Add filled star
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆'; // Add empty star
    }
    return stars;
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Rendered Components
  return (

    // Main View
    <View style={{ flex: 1 }}>
      {/* Image + Text overlay */}
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

      {/* Products for you + Tabs + Search Bar */}
      <Animated.View style={{ height: headerHeight, justifyContent: 'flex-end', alignItems: 'center'}}>

        {/* Products for you */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}> {'\n'}Products For You </Text>
        </View>
        
        {/* Tabs */}
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
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            onChangeText={(text) => {
              setSearchQuery(text); // Update searchQuery state with user input
            }}
            value={searchQuery} // Bind the value of the TextInput to the state
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>X</Text>
          </TouchableOpacity>
          )}
        </View>
        
      {/* End of Products for you + Tabs + Search Bar */}
      </Animated.View>
      {/* End of collapsable header */}


      {/* Start of Products View */}
      <View>
        {/* Defining out scroll view */}
        <ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          onScrollEndDrag={({ nativeEvent }) => handleScrollEnd(nativeEvent)}
          scrollEventThrottle={16}
          ref={scrollViewRef}
        >

          {/* Tab 1: Skincare Products */}
          {activeTab === 'Button 1' && (
            <View style={styles.tabContentContainer}>
              {loadingSkincare && (
                <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator} />
              )}
              {filterProducts(skincareProducts, searchQuery).slice(0, visibleProducts).map(product => (
                <View key={product.asin} style={styles.productContainer}>
                  <ProductImage imageUrl={product.image} />
                  <TouchableOpacity onPress={() => setModalVisible({ visible: true, product })}>
                    <View style={styles.productTextContainer}>
                      <Text style={styles.productTitle}>{product.title.length > 80 ? `${product.title.substring(0, 80)}...` : product.title}</Text>
                      <View style={{ flexDirection: 'row', marginVertical: 8}}>
                        <Text style={{ color: '#008080' }}>{product.stars} </Text>
                        <Text style={{ color: '#FFA500' }}>{generateStars(product.stars)}</Text>
                        <Text style={{ color: "#808080" }}>{"("}{product.rating_count}{")"}</Text>
                      </View>
                      <Text style={{fontSize: 18}}>{product.price}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}


          {/* Tab 2: Makeup Products */}
          {activeTab === 'Button 2' && (
            <View style={styles.tabContentContainer}>
              {loadingMakeup && (
                <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator} />
              )}
              {filterProducts(makeupProducts, searchQuery).slice(0, visibleProducts).map(product => (
                <View key={product.asin} style={styles.productContainer}>
                  <ProductImage imageUrl={product.image} />
                  <TouchableOpacity onPress={() => setModalVisible({ visible: true, product })}>
                    <View style={styles.productTextContainer}>
                      <Text style={styles.productTitle}>{product.title.length > 80 ? `${product.title.substring(0, 80)}...` : product.title}</Text>
                      <View style={{ flexDirection: 'row', marginVertical: 8}}>
                        <Text style={{ color: '#008080' }}>{product.stars} </Text>
                        <Text style={{ color: '#FFA500' }}>{generateStars(product.stars)}</Text>
                        <Text style={{ color: "#808080" }}>{"("}{product.rating_count}{")"}</Text>
                      </View>
                      <Text style={{fontSize: 18}}>{product.price}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>


      {/* Start of Modal */}
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
                <View>
                  <Text style={styles.modalTitle}>{modalVisible.product.title}</Text>
                  <Image source={{ uri: modalVisible.product.image }} style={styles.modalImage} />
                  <TouchableOpacity onPress={handleLinkPress} style={styles.productPageButton}>
                    <Text style={styles.productPageButtonText}>See Product Page</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', marginVertical: 8}}>
                    <Text style={{ color: '#008080' }}>{modalVisible.product.stars} </Text>
                    <Text style={{ color: '#FFA500' }}>{generateStars(modalVisible.product.stars)}</Text>
                    <Text style={{ color: "#808080" }}>{"("}{modalVisible.product.rating_count}{")"}</Text>
                  </View>
                  <Text style={{fontSize: 18, marginBottom: 5}}>{modalVisible.product.price}</Text>
                </View>
              )}

              <TouchableOpacity onPress={() => setModalVisible({ visible: false, product: null })}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableWithoutFeedback>

      {/* End of Modal */}
      </Modal>

    {/* End of Main View */}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({

  loadingIndicator: {
    marginTop: 10,
  }, 

  closeButton: {
    ...this.text,
    fontSize: 18,
    textAlign: "center",
    fontFamily: 'Sofia-Sans',
    color: "#007AFF",
  },

  mainText: {
    ...this.text,
    fontSize: 18,
    textAlign: "center",
    fontFamily: 'Sofia-Sans',
  },

  textContainer: {
    alignItems: 'center',
  },

  titleText: {
    ...this.text,
    fontSize: 32,
    textAlign: "center",
    fontFamily: 'Sofia-Sans',
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
    fontFamily: 'Sofia-Sans',
  },

  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,

    ...Platform.select({
      ios: {
        marginHorizontal: 10,
      },
      android: {
        marginHorizontal: 10,
      }
    })
  },

  tabButton: {
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: 'black',

    ...Platform.select({
      ios: {
        paddingVertical: 6,
        paddingHorizontal: 55,
        marginHorizontal: 5,
      },
      android: {
        paddingVertical: 6,
        paddingHorizontal: 45,
        marginHorizontal: 5,
      }
    })
  },

  tabText: {
    fontWeight: 'bold',
    fontSize: 18,
    ...this.text,
  },

  tabContentContainer: {
    minHeight: 375,
    paddingBottom: 75,
    marginTop: 10,
    overflow: 'scroll',
  },

  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',

    ...Platform.select({
      ios: {
        marginBottom: 10,
        marginLeft: 7,
        width: "96%",
        height: 200,
      },
      android: {
        marginBottom: 10,
        marginLeft: 7,
        width: "96%",
        height: 200,
      }
    })
  },

  productTextContainer: {
    flex: 1,
    fontFamily: 'Sofia-Sans',

    ...Platform.select({
      ios: {
        marginLeft: 10,
        marginTop: 30,
        width: 225,
      },
      android: {
        marginLeft: 10,
        marginTop: 25,
        width: 200,
      }
    })
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
    fontFamily: 'Sofia-Sans',
  },

  activeTab: {
    backgroundColor: 'lightgray',
  },

  activeTabText: {
    color: 'black',
  },

  searchContainer: {
    ...Platform.select({
      ios: {
        paddingHorizontal: 15,
        marginTop: 0,
        marginBottom: 10,
        width: 400,
      },
      android: {
        paddingHorizontal: 15,
        marginTop: 0,
        marginBottom: 10,
        width: 375,
      }
    })
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  clearButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
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
    alignContent: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '90%',
    height: 'auto',
  },

  modalImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
    alignContent: 'center',
    alignSelf: 'center',
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Sofia-Sans',
  },

  productPageButton: {
    backgroundColor: '#64BBA1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 5,
  },

  productPageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});

export default ShopScreen;