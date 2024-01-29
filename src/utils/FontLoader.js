// FontLoader.js
import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'Spirax-Regular': require('../../assets/fonts/Spirax-Regular.ttf'),
    'Sofia-Sans': require('../../assets/fonts/Sofia-Sans.ttf'),
  });
};
