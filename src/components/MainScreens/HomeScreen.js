import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Image, Platform, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { ScrollView } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

import { loadFonts } from '../../utils/FontLoader'; 
import { useAuth } from '../../utils/AuthContext';
import { fetchDailyRoutines, getSkinAnalysisResults } from '../../utils/FirestoreDataService'; 
import { RoutineProvider } from '../../utils/RoutineContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useAuth();
  const currentDay = new Date().getDay();

  const [fontLoaded, setFontLoaded] = useState(false);
  const [dailyRoutines, setDailyRoutines] = useState([]);
  const [skinResults, setSkinResults] = useState([]);
  const [skinType, setSkinType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [healthySkinDisplayed, setHealthySkinDisplayed] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false); 
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);

  const terms = require('../../utils/json/terms.json');

  useEffect(() => {
    // Check if terms have been accepted
    const checkTermsAcceptance = async () => {
      try {
        if (!user) {
          // User is not logged in, no need to check terms acceptance
          return;
        } else {
          const accepted = await AsyncStorage.getItem(`acceptedTerms_${user.uid}`);
          if (accepted !== null) {
            setAcceptedTerms(true);
          } else {
            setShowTermsModal(true);
          }
        }
      } catch (error) {
        console.error('Error retrieving terms acceptance state:', error);
      }
    };

    checkTermsAcceptance();

    // Fetch daily routines function
    const fetchRoutines = async () => {
      try {
        setLoading(true);
        const routines = await fetchDailyRoutines(user.uid);
        setDailyRoutines(routines.filter(routine => routine.days === undefined || routine.days.includes(currentDay) || routine.id !== undefined));
        setLoading(false);
        console.log("DEBUG: Fetched daily routines:", routines);
      } catch (error) {
        console.error("DEBUG: Error fetching daily routines:", error);
        setLoading(false);
      }
    };

    // Fetch skin analysis results
    const fetchSkinResults = async () => {
      try {
        const results = await getSkinAnalysisResults(user.uid);
        setSkinResults(results[0].prediction);

        if (results) {
          // Determine skin type
          const normal = results[0].prediction.normal;
          const dry = results[0].prediction.dry;
          const oily = results[0].prediction.oily;
          if (dry > normal && dry > oily) {
              setSkinType('Dry');
          } else if (oily > normal && oily > dry) {
              setSkinType('Oily');
          } else if (normal > dry && normal > oily) {
              setSkinType('Normal');
          } else {
              setSkinType('Combination');
          } 

          if (!healthySkinDisplayed) {
            const keys = Object.keys(skinResults);
            const isHealthySkin = keys.every(key => skinResults[key] <= 0.05);
            if (isHealthySkin) {
              setHealthySkinDisplayed(true);
            }
          }
        } else {
            console.error("Error fetching skin analysis results.");
        }

        console.log("DEBUG: Fetched skin analysis results:", results);
      } catch (error) {
        console.log("DEBUG: Error fetching skin analysis results:", error);
      }
    };
  
    // Execute the async functions
    const loadData = async () => {
      await loadFonts();
      setFontLoaded(true);
      
      if (user) {
        await fetchRoutines();
        await fetchSkinResults();
      }
    };
  
    loadData();
  
    // Refresh daily routines when navigation is focused
    const unsubscribe = navigation.addListener('focus', async () => {
      await fetchRoutines();
      await fetchSkinResults();
    });
  
    return unsubscribe;
  }, [user, navigation, currentDay, setFontLoaded, setDailyRoutines, fetchDailyRoutines, setSkinResults, getSkinAnalysisResults, setSkinType, setLoading]);
  

  if (!user) {
    // User not logged in
    return null;
  };

  if (!fontLoaded || loading) {
    // Font is still loading or routines are being fetched, you can return a loading indicator or null
    return (
      <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color="#64BBA1"/>
      </View>
    );
  };

  const handleCameraClick = () => {
    navigation.navigate('GetStarted');
  };

  const handleSkinResultContainerClick = () => {
    navigation.navigate('ResultScreen');
  };
  
  // Function to refresh the Swiper component when a routine is deleted
  const refreshSwiper = async () => {
    try {
        setLoading(true);
        const routines = await fetchDailyRoutines(user.uid);
        setDailyRoutines(routines.filter(routine => routine.days === undefined || routine.days.includes(currentDay) || routine.id !== undefined));
        setLoading(false);
        console.log("DEBUG: Fetched daily routines:", routines);
    } catch (error) {
        console.error("DEBUG: Error fetching daily routines:", error);
        setLoading(false);
    }
  };

  // Pass refreshSwiper function as a parameter when navigating to Routine screen
  const handleRoutineClick = (routine) => {
    if (routine.title === `Add Routine`) {
        navigation.navigate('AddRoutine', { updateDailyRoutines, navigation });
    } else {
        console.log(`DEBUG: ${routine.title} clicked`);
        navigation.navigate('Routine', { routine, refreshSwiper:refreshSwiper }); // Mainly for deleting routines
    }
  };

  // Update daily routines
  const updateDailyRoutines = (newRoutine) => {
    setDailyRoutines([...dailyRoutines, newRoutine]);
  };

  // Function to calculate completion percentage
  const calculateCompletion = (routine) => {
    const totalSteps = routine.steps.length;
    const completedSteps = routine.stepCompletionStatus.filter(status => status === true).length;
    return (completedSteps / totalSteps) * 100;
  };

  const handleAcceptTerms = async () => {
    try {
      await AsyncStorage.setItem(`acceptedTerms_${user.uid}`, 'true');
      setAcceptedTerms(true);
      setShowTermsModal(false);
    } catch (error) {
      console.error('Error storing terms acceptance state:', error);
    }
  };

  const renderTermsSummary = () => {
    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Terms of Use</Text>
        <Text style={{...styles.modalTitle, fontSize: 18, fontWeight: 'normal'}}>Welcome to TrueMe!</Text>
        <Text style={styles.modalText}>
          By using our service, you agree to our terms, ensuring your privacy and data protection. 
          We provide skin analysis and recommendations for informational purposes only, urging users to consult dermatologists for professional advice.
          We do not guarantee results and users are liable for their actions. We may update our terms, and for any questions, contact us.
        </Text>
        <TouchableOpacity style={{ marginTop: 0, marginBottom: 20, marginHorizontal: 10, alignSelf: 'center' }} onPress={() => setShowFullTerms(true)}>
          <Text style={styles.readMoreButtonText}>Read More</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptTerms}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFullTerms = () => {
    return (
      <ScrollView style={styles.fullTermsContainer}>
        {terms ? (
          <>
            {terms.welcomeMessage && <Text style={styles.welcomeMessage}>{terms.welcomeMessage}</Text>}
            {terms.termsOfUse && terms.termsOfUse.sections.map(section => (
              <View key={section.title} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.subsections.map(subsection => (
                  <View key={subsection.title} style={styles.subsectionContainer}>
                    <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                    <Text style={styles.subsectionContent}>{subsection.content}</Text>
                  </View>
                ))}
              </View>
            ))}
            <TouchableOpacity style={{ marginTop: 0, marginBottom: 20, marginHorizontal: 10, alignSelf: 'center' }} onPress={() => setShowFullTerms(false)}>
              <Text style={styles.readLessButtonText}>Read Less</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButtonFull} onPress={handleAcceptTerms}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading terms...</Text>
        )}
      </ScrollView>
    );
  };
  

  return (
    <RoutineProvider updateDailyRoutines={updateDailyRoutines}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>



          {/* Terms of Use Modal */}

          <Modal
            visible={showTermsModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowTermsModal(false)}
          >
            <View style={styles.modalContainer}>
              {showFullTerms ? renderFullTerms() : renderTermsSummary()}
            </View>
          </Modal>

          {/* Top Container */}
          <View style={styles.topContainer}>
            <Text style={styles.topContainerText}>Hello {user.displayName}!</Text>
          <Image source={require('../../../assets/images/home_top_image.png')} style={{alignSelf: "center"}}/>
          </View>

          {/* Skin Diagnostic Container */}
          <View style={styles.skinResultContainer}>
            {/* Display loading indicator if fetching skin data */}
            {loading ? (
              <View style={{alignSelf: "center"}}>
                <ActivityIndicator size="large" color="#64BBA1" />
              </View>
            ) : (
              // Display skin analysis results or camera icon based on availability
              <>
                {skinResults.length === 0 ? (
                  // If there are no skin results, show camera icon
                  <>
                    {/* Container Title */}
                    <View style={styles.textContainer}>
                      <Text style={styles.mainText}>Skin Diagnostic Results</Text>
                      <Text style={styles.textStyle}>Start your journey to healthy skin here!</Text>
                    </View>
                    
                    <TouchableOpacity onPress={handleCameraClick}>
                      <Image source={require('../../../assets/icons/large_camera.png')} style={styles.cameraButton}/>
                      <Text style={styles.cameraButtonText}>Click to scan your face</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  // If there are skin results, display them
                  <>
                    <TouchableOpacity onPress={handleSkinResultContainerClick}>
                      {/* Container Title */}
                      <View style={styles.textContainer}>
                        <Text style={styles.mainText}>Your Skin Type:</Text>
                        <Text style={styles.skinType}> {skinType} Skin</Text>
                      </View>
                      
                      <Text style={styles.skinDiagnostics}>Skin Diagnostic Results:</Text>
                      {Object.entries(skinResults)
                        .filter(([key]) => key !== "normal" && key !== "oily" && key !== "dry") // Filter out "normal", "oily", and "dry"
                        .sort(([, a], [, b]) => b - a) // Sorting based on prediction values
                        .map(([key], index) => {
                          const prediction = skinResults[key];
                          if (prediction > 0.05) {
                            // If the prediction is above 0.05, render the prediction text
                            return (
                              <View key={index}>
                                <Text style={styles.resultsText}> • {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Text>
                              </View>
                            );
                          } else {
                            // If the prediction is below or equal to 0.05, do not render
                            return null;
                          }
                      })}
                      {Object.entries(skinResults)
                        .filter(([key]) => key !== "normal" && key !== "oily" && key !== "dry") // Filter out "normal", "oily", and "dry"
                        .every(([, prediction]) => prediction <= 0.05) && (
                        // If all predictions are below 0.05, display "Healthy Skin"
                        <Text style={styles.resultsText}>Healthy Skin!!</Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>

          {/* Daily Routines Container */}
          <View style={styles.dailyRoutinesContainer}>
            {/* Daily Routines Cards */}
            <Swiper
              cards={dailyRoutines}
              renderCard={(item) => (
                <View key={item?.id} style={styles.dailyRoutinesCards}>
                  {item ? ( // Check if item is defined
                    <View>
                      {/* Your card content here */}
                      <View>
                        {/* Status bar */}
                        {item.title !== 'Add Routine' ? (
                          <View style={{ justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                              <View style={styles.leafIconContainer}>
                                <Image source={require('../../../assets/icons/leaf-heart.png')} />
                              </View>
                              <TouchableOpacity onPress={() => handleRoutineClick(item)}>
                                <Text style={styles.dailyRoutineText}>{item.title}</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.statusBarContainer}>
                              <Text style={styles.statusBarText}>{calculateCompletion(item).toFixed(0)}% </Text>
                              <View style={styles.statusBar}>
                                <View style={[styles.statusBarFill, { width: `${calculateCompletion(item)}%` }]} />
                              </View>
                            </View>
                          </View>
                        ) : (
                          <TouchableOpacity onPress={() => handleRoutineClick(item)}>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Image source={require('../../../assets/icons/add.png')} style={styles.addRoutineIcon} />
                              <Text style={styles.addRoutineText}>{item.title}</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.loadingCard}>
                      <ActivityIndicator size="large" color="#64BBA1" />
                    </View>
                  )}
                </View>
              )}
              keyExtractor={(item) => `${item?.id}`}
              stackSize={2}
              stackSeparation={0}
              stackScale={3}
              infinite={dailyRoutines.length === 1 ? false : true}
              animateOverlayLabelsOpacity
              animateCardOpacity
              cardHorizontalMargin={0}
              cardVerticalMargin={0}
              disableTopSwipe={dailyRoutines.length === 1 ? true : false}
              disableLeftSwipe={dailyRoutines.length === 1 ? true : false}
              disableRightSwipe={dailyRoutines.length === 1 ? true : false}
              disableBottomSwipe={true}
              useViewOverflow={Platform.OS === 'ios' ? true : false}
              onSwiped={(cardIndex) =>
                console.log(
                  "DEBUG: Swiped",
                  dailyRoutines[cardIndex].title,
                  "card"
                )
              }
            />


          </View>

        </ScrollView>


      </SafeAreaView>
    </RoutineProvider>
  );
};

// Styles

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FAFAFA",
      width: "100%",
      flexGrow: 1,

      ...Platform.select({
        ios: {
          useViewOverflow: true
        },
        android: {
          useViewOverflow: false,
          nestedScrollEnabled: true 
        }
      })
    }, // End of container

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      margin: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
    },
    acceptButtonFull: {
      backgroundColor: '#64BBA1',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 40,
    },
    acceptButton: {
      backgroundColor: '#64BBA1',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 10, 
    },
    acceptButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    readMoreButtonText: {
      color: '#64BBA1',
      fontSize: 16,
      fontWeight: 'bold',
    },
    fullTermsContainer: {
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 10,
      maxHeight: '80%',
      margin: 20,
    },
    fullTermsText: {
      fontSize: 16,
    },
    readLessButtonText: {
      color: '#64BBA1',
      fontSize: 16,
      fontWeight: 'bold',
    },
    welcomeMessage: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    sectionContainer: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subsectionContainer: {
      marginLeft: 20,
      marginBottom: 10,
    },
    subsectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    subsectionContent: {
      fontSize: 14,
      marginBottom: 5,
    },

    loadingText: {
      marginTop: 20,
      fontSize: 16,
      color: '#000', // You can customize the text color
      fontFamily: 'Sofia-Sans',
      width: "90%",
      textAlign: 'center',
      alignSelf: "center",
    },

    loadingCard: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    scrollView: {
      flex: 1,
      marginBottom: 20,
      height: "100%",
      nestedScrollEnabled: true,
      flexGrow: 1,
      
      ...Platform.select({
        ios: {
          useViewOverflow: true
        },
        android: {
          useViewOverflow: false,
          nestedScrollEnabled: true 
        }
      })
    }, // End of scrollView

    leafIconContainer: {
      borderRadius: 10, 
      borderWidth: 1,
      borderColor: '#AEAEAE',
      padding: 5,
      alignSelf: "flex-start",

      ...Platform.select({
        ios: {
          marginTop: 5,
          marginBottom: 5,
          marginRight: 5,
          marginLeft: -8,
          bottom: 3,
        },

        android: {
          marginTop: 10,
          marginBottom: 5,
          marginRight: 5,
          marginLeft: -8,
          bottom: 3,
        }
      }),
    },

    addRoutineIcon: {
      marginTop: 5,
      width: 40,
      height: 40,
      marginLeft: 20,
      marginRight: 20
    },

    statusBar: {
      alignSelf: "center",
      backgroundColor: '#E0E0E0',
      height: 10,
      borderRadius: 50,
      width: '65%', // Added width property
    },

    statusBarFill: {
      height: '100%',
      backgroundColor: '#64BBA1',
      borderRadius: 50,
      width: '100%',
    },

    statusBarText: {
      fontSize: 14,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "left",
      alignSelf: "flex-start",
    },

    statusBarContainer : {
      width: '35%',
      flexDirection: 'row',
      backgroundColor: '#EBF5F5',
      borderRadius: 10,

      paddingRight: 10,
      paddingBottom: 10,
      paddingTop: 10,
      paddingLeft: 5,

      bottom: 50,
      alignSelf: "flex-end",
      marginRight: -10
    },

    loadingIndicator: {
      marginTop: 300,
    }, // End of loadingIndicator

    topContainer: {
      backgroundColor: "#D0F2DA",
      width: "90%",
      height: 219,
      borderRadius: 35,
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      elevation: 5,
      alignSelf: "center",
      padding: 20,

      ...Platform.select({
        ios: {
          marginTop: 0,
        },
        android: {
          marginTop: 40,
        }
      })

    }, // End of topContainer

    topContainerText: {
      fontSize: 32,
      fontFamily: 'Sofia-Sans',
      color: '#64BBA1',
      textAlign: "center",
      marginBottom: 7,
    }, // End of topContainerText

    skinResultContainer: {
      backgroundColor: "#FFFFFF",
      width: "90%",
      height: 320,
      borderRadius: 35,
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      elevation: 5,
      alignSelf: "center",
      padding: 20,

      marginTop: 20,
      marginBottom: 0
    }, // End of skinResultContainer

    dailyRoutinesContainer: {
      flex: 1, 
      flexGrow: 1, 
      flexWrap: "wrap",
      marginTop: 10,

      ...Platform.select({
        ios: {
          marginBottom: 10
        },

        android: {
          // Need for android to function properly
          marginBottom: 225
        }

      }),
    }, // End of dailyRoutinesContainer

    dailyRoutinesCards: {
      backgroundColor: "#FFFFFF",
      width: "90%",
      height: 90,
      borderRadius: 35,
      
      elevation: 5,
      marginTop: 10,
      alignSelf: "center",
      padding: 20,
      
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,

    }, // End of dailyRoutinesCards

    textContainer: {
      marginBottom: 30
    }, // End of textContainer
  
    mainText: {
      fontSize: 24,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "left",
      marginBottom: 10
    }, // End of mainText

    textStyle: {
      fontSize: 16,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "center",
    }, // End of textStyle

    skinType: {
      fontSize: 28,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "left",
    }, // End of skinType

    skinDiagnostics: {
      fontSize: 24,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "left",
      marginBottom: 10
    },

    resultsText: {
      fontSize: 16,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "left",
      margin: 5,
    },
  
    buttons: {
      width: 159,
      height: 82,
      backgroundColor: '#D0F2DA',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#7FB876',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: "center",
    }, // End of buttons

    cameraButton: {
      overflow: 'hidden',
      borderColor: '#64BBA1',
      borderWidth: 2,
      borderRadius: 100,
      alignSelf: "center",
    }, // End of cameraButton
  
    buttonText: {
      fontSize: 32,
      fontFamily: 'Sofia-Sans',
      color: '#64BBA1',
      textAlign: "center",
    }, // End of buttonText

    cameraButtonText: {
      fontSize: 16,
      fontFamily: 'Sofia-Sans',
      color: '#64BBA1',
      textAlign: "center",
      marginTop: 10
    }, // End of cameraButtonText

    dailyRoutineItem: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      borderRadius: 35,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: "center",
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      elevation: 5,
      marginHorizontal: 10,
    }, // End of dailyRoutineItem
  
    dailyRoutineText: {
      fontSize: 20,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "left",

      ...Platform.select({
        ios: {
          marginTop: 10,
          marginBottom: 10,
          marginRight: 10,
          marginLeft: 2,
        },

        android: {
          marginTop: 15,
          marginBottom: 10,
          marginRight: 10,
        }
      }),
    }, // End of dailyRoutineText

    addRoutineText: {
      fontSize: 22,
      fontFamily: 'Sofia-Sans',
      color: '#000000',
      textAlign: "left",
      marginRight: 20,
    }, // End of addRoutineText
  
  });

export default HomeScreen;
