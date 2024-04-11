import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadFonts } from '../../utils/FontLoader';
import { useAuth } from '../../utils/AuthContext';
import { fetchDailyRoutines, 
         getSkinAnalysisResults, 
         fetchBannerImage, 
         fetchProfileImage } from '../../utils/FirestoreDataService';

import affirmations from '../../utils/affirmations.json'; // Adjust the file path as needed

import { useData } from '../../utils/DataContext';

const AppLoading = () => {
  const { data, setData } = useData();
  const navigation = useNavigation();
  const user = useAuth();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [affirmation, setAffirmation] = useState('');

  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    return affirmations[randomIndex];
  };

  useEffect(() => {
    setAffirmation(getRandomAffirmation());
  }, []);

  useEffect(() => {

    const loadData = async () => {
      if (!data.dailyRoutines) {
        const routines = await fetchDailyRoutines(user.uid);
        setData((prevData) => ({ ...prevData, dailyRoutines: routines }));
      }

      if (!data.bannerImage) {
        const bannerImage = await fetchBannerImage(user.uid);
        setData((prevData) => ({ ...prevData, bannerImage }));
      }

      if (!data.profileImage) {
        const profileImage = await fetchProfileImage(user.uid);
        setData((prevData) => ({ ...prevData, profileImage }));
      }

      if (!data.skinAnalysisResults) {
        const skinAnalysisResults = await getSkinAnalysisResults(user.uid);
        setData((prevData) => ({ ...prevData, skinAnalysisResults }));
      }
    };

    loadData().then(() => {
      setFontLoaded(true);
      navigation.navigate('HomeScreen');
    });
  }, [data, navigation, setData, user]);

  if (!fontLoaded) {
    // Font is still loading, you can return a loading indicator or null
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#64BBA1" />
        <Text style={styles.text}>{affirmation}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#64BBA1" />
      <Text style={styles.text}>{affirmation}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // You can customize the background color
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#000', // You can customize the text color
    fontFamily: 'Sofia-Sans',
    width: "90%",
    textAlign: 'center',
  },
});

export default AppLoading;
