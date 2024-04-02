import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // console.log('Before useState:'); // Debug
  const [user, setUser] = useState(null);
  // console.log('After useState, user:', user); // Debug


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authUser) => {
      try {
        if (authUser) {
          setUser(authUser);
          await AsyncStorage.setItem('user', JSON.stringify(authUser)); // Store user data
        } else {
          setUser(null);
          await AsyncStorage.removeItem('user'); // Remove user data
        }
      } catch (error) {
        console.error('Error setting user:', error);
      }
    });
  
    // Check for stored user data on app startup ß
    const checkStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
  
    checkStoredUser();
  
    return () => unsubscribe();
  }, []);
  

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
