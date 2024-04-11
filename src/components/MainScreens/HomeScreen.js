import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Image, Platform, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { ScrollView } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';

import { loadFonts } from '../../utils/FontLoader'; 
import { useAuth } from '../../utils/AuthContext';
import { fetchDailyRoutines, getSkinAnalysisResults } from '../../utils/FirestoreDataService'; 
import { RoutineProvider } from '../../utils/RoutineContext';
import { AuthProvider } from '../../utils/AuthContext';

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

  useEffect(() => {
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
    return <ActivityIndicator size="large" color="#64BBA1" style={styles.loadingIndicator}/>;
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


  return (
    <RoutineProvider updateDailyRoutines={updateDailyRoutines}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
            {/* Top Container */}
            <View style={styles.topContainer}>
              <Text style={styles.topContainerText}>Hello {user.displayName}!</Text>
            <Image source={require('../../../assets/images/home_top_image.png')} style={{alignSelf: "center"}}/>
            </View>

            {/* Skin Diagnostic Container */}
            <View style={styles.skinResultContainer}>
              {/* Display skin analysis results */}
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
                // If there are skin results, display top 3 greatest results
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
      ...Platform.select({
        ios: {
          backgroundColor: "#D0F2DA",
          width: 348,
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
        },

        android: {
          backgroundColor: "#D0F2DA",
          width: 330,
          height: 219,
          borderRadius: 35,

          elevation: 5,
          marginTop: 40,
          alignSelf: "center",
          padding: 20,

          shadowColor: 'black',
          shadowOffset: { width: 0, height: 3, },
          shadowOpacity: 0.25,
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
      ...Platform.select({
        ios: {
          backgroundColor: "#FFFFFF",
          width: 348,
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
        },

        android: {
          backgroundColor: "#FFFFFF",
          width: 330,
          height: 300,
          borderRadius: 35,

          elevation: 5,
          marginTop: 30,
          marginBottom: 5,
          alignSelf: "center",
          padding: 20,

          shadowColor: 'black',
          shadowOffset: { width: 0, height: 3, },
          shadowOpacity: 0.25,
        }
      })
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
      ...Platform.select({
        ios: {
          backgroundColor: "#FFFFFF",
          width: 348,
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

        },

        android: {
          backgroundColor: "#FFFFFF",
          width: 330,
          height: 100,
          borderRadius: 35,

          elevation: 5,
          marginTop: 10,
          alignSelf: "center",
          padding: 20,

          shadowColor: 'black',
          shadowOffset: { 
            width: 0, 
            height: 3, 
          },
          shadowOpacity: 0.25,

        }

      })

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
