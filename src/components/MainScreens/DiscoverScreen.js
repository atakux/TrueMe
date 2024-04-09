import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Animated,
  Modal,
  ActivityIndicator,
  Button,
  Linking,
  TouchableWithoutFeedback
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, getDisplayName } from 'firebase/auth';
import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';
import fetchAmazonProductData from '../../utils/API/amazonAPI';


// DiscoverScreen component
const DiscoverScreen = () => {
  // Declare and initialize react state variables
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const user = useAuth();

  // Declare and initialize amazon product state variables
  const [AllProducts, setAllProducts] = useState([]);
  const [faceCreamData, setFaceCreamData] = useState([]);
  const [eyelinerData, setEyelinerData] = useState([]);
  const [foundationData, setFoundationData] = useState([]);

  // Declare and initialize loading state variables
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingFaceCream, setLoadingFaceCream] = useState(true);
  const [loadingEyeliner, setLoadingEyeliner] = useState(true);
  const [loadingFoundation, setLoadingFoundation] = useState(true);

  // Declare and initialize visible products state variable
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Declare and initialize tab and filter state variables
  const [activeTab, setActiveTab] = useState('All');
  const [activeFilter, setActiveFilter] = useState('Trending');
  const [filterModalVisible, setFilterModalVisible] = useState({ visible: false, product: null });
  const [modalVisible, setModalVisible] = useState({ visible: false, product: null });


  // Functions to handle tab changes
  const handleButtonClick = (buttonName) => {
    visibleProducts <= 10 ? setVisibleProducts(10) : setVisibleProducts(10);
    setActiveTab(buttonName);
  };

  // Functions to handle sort by/filter changes
  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
    setFilterModalVisible(false);
    visibleProducts <= 10 ? setVisibleProducts(10) : setVisibleProducts(10);
  };

  // Functions to handle product modal visibility
  const handleLinkPress = () => {
    if (modalVisible.product && modalVisible.product.url) {
      Linking.openURL(modalVisible.product.url);
    }
  };


  // Function to add more products when scrolled to the bottom
  const handleScrollEnd = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 10);
    }
  };

  // Function to filter products based on search query and filter
  const filterProducts = (products, query, sortBy) => {
    let filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    if (sortBy === 'Price') {
      filteredProducts.sort((a, b) => {
        // Convert price strings to numbers for comparison
        const priceA = parseFloat(a.price.replace('$', ''));
        const priceB = parseFloat(b.price.replace('$', ''));
        // Sort products in ascending order based on price
        return priceA - priceB;
      });
    } else if (sortBy === 'Rating') {
      // Sort products in descending order based on rating
      filteredProducts.sort((a, b) => b.stars - a.stars);
    } else if (sortBy === 'Trending') {
      filteredProducts.sort((a, b) => b.rating_count - a.rating_count);
    }
    return filteredProducts;
  };
  
  // Function to render product image
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

  // Function to generate star rating visuals
  function generateStars(rating) {
    const maxRating = 5;
    const filledStars = Math.floor(rating);
    const emptyStars = maxRating - filledStars;
    let stars = '';
    for (let i = 0; i < filledStars; i++) {
      stars += '★'; 
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += '☆'; 
    }
    return stars;
  }


  // API calls to fetch amazon prouct data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await fetchAmazonProductData("Skincare and Makeup");
        setAllProducts(allData.data);
        setLoadingAll(false);

        const faceCreamData = await fetchAmazonProductData("Face Cream");
        setFaceCreamData(faceCreamData.data);
        setLoadingFaceCream(false);

        const eyelinerData = await fetchAmazonProductData("Eyeliner");
        setEyelinerData(eyelinerData.data);
        setLoadingEyeliner(false);

        const foundationData = await fetchAmazonProductData("Foundation");
        setFoundationData(foundationData.data);
        setLoadingFoundation(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Render the header (Username + Greeting + Tabs)  
  const Header = ({ user }) => (
    <View>
      <View style={{ marginTop: 15, marginLeft: 15 }}>
        <Text style={styles.greetingText}>Hello {user.displayName}!</Text>
      </View>

      <View style={{ marginTop: 10, marginLeft: 15 }}>
        <Text style={styles.titleText}>Let's Discover Hot New Beauty Products</Text>
      </View>
  
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => handleButtonClick("All")}
            style={[styles.tabButton, activeTab === 'All' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>All</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() => handleButtonClick("Face Cream")}
            style={[styles.tabButton, activeTab === 'Face Cream' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'Face Cream' && styles.activeTabText]}>Face Cream</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() => handleButtonClick("Eyeliner")}
            style={[styles.tabButton, activeTab === 'Eyeliner' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'Eyeliner' && styles.activeTabText]}>Eyeliner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleButtonClick("Foundation")}
            style={[styles.tabButton, activeTab === 'Foundation' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'Foundation' && styles.activeTabText]}>Foundation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );


  // Render the content of the screen
  return (
    <SafeAreaView style={styles.container}>
      <Header user={user} />

      {/* Search bar */}
      <View style={[styles.searchContainer, { marginTop: 10 }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>X</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Modal (Trending, Price, Rating) */}
      <View style={styles.filterContainer}>
        
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Sort By: {activeFilter}</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={filterModalVisible}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.filterModalContainer}>


              <TouchableOpacity
                onPress={() => handleFilterChange("Trending")}
                style={[styles.filterButton, activeTab === 'Trending' && styles.activeTab]}
              >
                <Text style={[styles.filterButtonText, activeTab === 'Trending' && styles.filterButtonText]}>Trending</Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => handleFilterChange("Price")}
                style={[styles.filterButton, activeTab === 'Price' && styles.activeTab]}
              >
                <Text style={[styles.filterButtonText, activeTab === 'Price' && styles.filterButtonText]}>Price</Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => handleFilterChange("Rating")}
                style={[styles.filterButton, activeTab === 'Rating' && styles.activeTab]}
              >
                <Text style={[styles.filterButtonText, activeTab === 'Rating' && styles.filterButtonText]}>Rating</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ 
                  borderRadius: 10, // Set border radius for rounded corners
                  paddingHorizontal: 20, // Add horizontal padding
                  paddingVertical: 10, // Add vertical padding
                }}
                onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
      {/* End of Filter Modal */}



      {/* Scrollable content => Products */}
      <ScrollView style={styles.scrollContainer} 
        contentContainerStyle={{paddingBottom: 75}}
        onScrollEndDrag={({ nativeEvent }) => handleScrollEnd(nativeEvent)}
        scrollEventThrottle={16}
      >
        {['All', 'Face Cream', 'Eyeliner', 'Foundation'].map((tabName) => (
          <View key={tabName} style={activeTab === tabName ? styles.tabContentContainer : { display: 'none' }}>
            {activeTab === tabName && (
      <View>
        {tabName === 'All' && loadingAll && (
          <ActivityIndicator size="large" color="#64BBA1" style={[styles.loadingIndicator, { marginTop: 50 }]} />
        )}
        {tabName === 'Face Cream' && loadingFaceCream && (
          <ActivityIndicator size="large" color="#64BBA1" style={[styles.loadingIndicator, { marginTop: 50 }]} />
        )}
        {tabName === 'Eyeliner' && loadingEyeliner && (
          <ActivityIndicator size="large" color="#64BBA1" style={[styles.loadingIndicator, { marginTop: 50 }]} />
        )}
        {tabName === 'Foundation' && loadingFoundation && (
          <ActivityIndicator size="large" color="#64BBA1" style={[styles.loadingIndicator, { marginTop: 50 }]} />
        )}
      </View>
      
    )}
          <View style={styles.productsWrapper}>
            {filterProducts(
              tabName === 'All' ? AllProducts :
              tabName === 'Face Cream' ? faceCreamData :
              tabName === 'Eyeliner' ? eyelinerData :
              foundationData, 
              searchQuery,
              activeFilter // Set sortBy parameter to 'price'
            ).slice(0, visibleProducts).map(product => (
              <View key={product.asin} style={styles.productContainer}>
                <ProductImage imageUrl={product.image} />
                <TouchableOpacity onPress={() => setModalVisible({ visible: true, product })}>
                  <View style={styles.productTextContainer}>
                    <Text style={styles.productTitle}>{product.title.length > 15 ? `${product.title.substring(0, 15)}...` : product.title}</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 8}}>
                      <Text style={{ color: '#008080', fontSize: 12 }}>{product.stars} </Text>
                      <Text style={{ color: '#FFA500', fontSize: 12 }}>{generateStars(product.stars)}</Text>
                      <Text style={{ color: "#808080", fontSize: 12 }}>{"("}{product.rating_count}{")"}</Text>
                    </View>
                    <Text style={{fontSize: 15}}>{product.price}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ))}



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
                    <Text style={{fontSize: 18}}>{modalVisible.product.price}</Text>
                  </View>
                )}
                <TouchableOpacity onPress={() => setModalVisible({ visible: false, product: null })}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  closeButtonText: {
    color: '#64BBA1',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space between tab buttons
    alignItems: 'center', // Center items vertically
    marginTop: 10,
    paddingHorizontal: 10, // Added paddingHorizontal for even spacing
  },
  productContainer: {
    width: '45%',
    height: 200,
    paddingBottom: 75,
    marginTop: 10,
    overflow: 'scroll',
    backgroundColor: '#FFFFFF',
    marginLeft: 5, // Reduced margin between columns
    marginRight: 5, // Reduced margin between columns
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center', // Align items horizontally in the center
  },
  

  productsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 0,
  },

  tabButton: {
    flex: 1, // Each tab button takes equal space
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#DDDDDD',
    borderRadius: 8,
    marginHorizontal: 5, // Add some horizontal margin for spacing
  },

  tabText: {
    fontSize: 16,
  },
  activeTab: {
    backgroundColor: '#64BBA1',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  greetingText: {
    fontSize: 30,
    fontFamily: 'Inter-Regular',
    color: '#212121',
    textAlign: "left",
  },
  titleText: {
    fontSize: 20,
    fontFamily: 'Inter-Regular',
    color: '#212121',
    textAlign: "left",
  },
  searchContainer: {
    paddingHorizontal: 15,
    marginTop: 0,
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

  productimage: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    marginLeft: 10,
    marginTop: 10,
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

  filterContainer: {
    paddingHorizontal: 15,
    marginTop: 0,
    marginBottom: 5,
  },

  
  filterButton: {
    backgroundColor: '#64BBA1',
    width: 175,
    height: 40,
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 5,
  },

  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  filterModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
  },
});

export default DiscoverScreen;