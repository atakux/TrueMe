import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCarlG15FWLeAZRMPP_bncctC0G2CV8GcU",
    authDomain: "trueme-14669.firebaseapp.com",
    projectId: "trueme-14669",
    storageBucket: "trueme-14669.appspot.com",
    messagingSenderId: "398166002189",
    appId: "1:398166002189:web:b852f5c44d4876f207e344",
    measurementId: "G-4N9GL5QSG4"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
