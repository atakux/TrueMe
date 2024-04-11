import { FIRESTORE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from "../../firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, getDoc, setDoc, query, where } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"; // Add this import for deleting auth account
import "firebase/compat/storage";

const fetchDailyRoutines = async (uid) => {
  try {
    // Fetch daily routines from user based on their uid
    const routineRef = collection(FIRESTORE_DB, "users", uid, "routines");
    const snapshot = await getDocs(routineRef);
    const routines = [];

    snapshot.forEach((doc) => {
      routines.push({
        id: doc.id,
        title: doc.data().title,
        days: doc.data().days,
        steps: doc.data().steps,
        stepCompletionStatus: doc.data().stepCompletionStatus
      });
    });

    return routines;
  } catch (error) {
    console.error("DEBUG: Error fetching daily routines:", error);
    throw error;
  }
};

const addRoutine = async (userId, routineData, updateDailyRoutines) => {
  try {
    // Add routine to user's routines collection in Firestore
    const routinesDocRef = collection(FIRESTORE_DB, 'users', userId, 'routines');
    const docRef = await addDoc(routinesDocRef, {
      title: routineData.title,
      days: routineData.days,
      steps: routineData.steps,
      stepCompletionStatus: routineData.stepCompletionStatus
    });

    // Call the update function passed from HomeScreen to update dynamically
    updateDailyRoutines({ id: docRef.id, ...routineData });

    console.log('DEBUG: ', routineData.title, 'added successfully');
  } catch (error) {
    console.error('DEBUG: Error adding routine: ', error);
    throw error;
  }
};

const deleteRoutine = async (userId, routineId) => {
  try {
      // Delete routine document from Firestore
      await deleteDoc(doc(FIRESTORE_DB, "users", userId, "routines", routineId));
      console.log(`DEBUG: Routine with ID ${routineId} deleted`);
  } catch (error) {
      console.error("DEBUG: Error deleting routine:", error);
      throw error;
  }
};

const updateRoutine = async (userId, routineId, updatedRoutine) => {
  try {
    console.log("DEBUG: Updated routine: ", updatedRoutine);

    const routinesDocRef = doc(FIRESTORE_DB, 'users', userId, 'routines', routineId);
    // Update routine document in Firestore
    await updateDoc(routinesDocRef, {
      title: updatedRoutine.title,
      days: updatedRoutine.days,
      steps: updatedRoutine.steps,
      stepCompletionStatus: updatedRoutine.stepCompletionStatus
    });

    console.log(`DEBUG: Routine with ID ${routineId} updated with data ${JSON.stringify(updatedRoutine)}`);
  } catch (error) {
      console.error("DEBUG: Error updating routine:", error);
      throw error;
  }
};

const uploadBannerImage = async (userId, imageUri) => {
  
  try {
    // Reference to the user's images collection
    const imagesCollectionRef = collection(FIRESTORE_DB, "users", userId, "images");

    // Convert the image data URI to a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload image blob to Firebase Storage
    const storageRef = ref(FIREBASE_STORAGE, `images/${userId}/banner`);
    const uploadTaskSnapshot = await uploadBytes(storageRef, blob);
    
    if (!uploadTaskSnapshot) {
      throw new Error("Upload task snapshot is undefined");
    }

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(uploadTaskSnapshot.ref);

    console.log("DEBUG: Image URL: ", imageUrl);

    // Add the image URL to Firestore
    const imagesDocRef = doc(imagesCollectionRef, "banner");
    await setDoc(imagesDocRef, {
      banner: imageUrl
    });

    console.log('DEBUG: Image uploaded successfully');
  } catch (error) {
    console.log("DEBUG: Image URI: ", imageUri);
    console.error('DEBUG: Error uploading image: ', error);
    throw error;
  }
};

const fetchBannerImage = async (userId) => {
  try {
    // Reference to the user's images collection
    const imagesCollectionRef = collection(FIRESTORE_DB, "users", userId, "images");

    // Get the document with ID "banner" from the images collection
    const bannerDocRef = doc(imagesCollectionRef, "banner");
    const bannerDocSnapshot = await getDoc(bannerDocRef);

    // Check if the banner document exists
    if (!bannerDocSnapshot.exists()) {
      return null; // Banner image not found
    }

    // Get the banner image URL from the document data
    const bannerImageData = bannerDocSnapshot.data();
    if (bannerImageData && bannerImageData.banner) {
      return bannerImageData.banner;
    } else {
      console.log("DEBUG: Banner image URL not found in document");
      return null;
    }
  } catch (error) {
    console.error("DEBUG: Error fetching banner image:", error);
    throw error;
  }
};

const uploadProfileImage = async (userId, imageUri) => {
  
  try {
    // Reference to the user's images collection
    const imagesCollectionRef = collection(FIRESTORE_DB, "users", userId, "images");

    // Convert the image data URI to a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload image blob to Firebase Storage
    const storageRef = ref(FIREBASE_STORAGE, `images/${userId}/profileImg`);
    const uploadTaskSnapshot = await uploadBytes(storageRef, blob);
    
    if (!uploadTaskSnapshot) {
      throw new Error("Upload task snapshot is undefined");
    }

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(uploadTaskSnapshot.ref);

    console.log("DEBUG: Image URL: ", imageUrl);

    // Add the image URL to Firestore
    const imagesDocRef = doc(imagesCollectionRef, "profileImg");
    await setDoc(imagesDocRef, {
      profileImg: imageUrl
    });

    console.log('DEBUG: Image uploaded successfully');
  } catch (error) {
    console.log("DEBUG: Image URI: ", imageUri);
    console.error('DEBUG: Error uploading image: ', error);
    throw error;
  }
};

const fetchProfileImage = async (userId) => {
  try {
    // Reference to the user's images collection
    const imagesCollectionRef = collection(FIRESTORE_DB, "users", userId, "images");

    // Get the document with ID "profileImg" from the images collection
    const profileDocRef = doc(imagesCollectionRef, "profileImg");
    const profileDocSnapshot = await getDoc(profileDocRef);

    // Check if the banner document exists
    if (!profileDocSnapshot.exists()) {
      return null; // Profile image not found
    }

    // Get the profile image URL from the document data
    const profileImageData = profileDocSnapshot.data();
    if (profileImageData && profileImageData.profileImg) {
      return profileImageData.profileImg;
    } else {
      console.log("DEBUG: Profile image URL not found in document");
      return null;
    }
  } catch (error) {
    console.error("DEBUG: Error fetching profile image:", error);
    throw error;
  }
};

const updateUsernameInFirestore = async (userId, newUsername) => {
  try {
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    await updateDoc(userDocRef, {
      username: newUsername
    });
    console.log('DEBUG: Username updated successfully');
  } catch (error) {
    console.error('DEBUG: Error updating username:', error);
    throw error;
  }
};

const deleteAuthAccount = async (email, password) => {
  try {
    // Reauthenticate user to delete account
    const user = FIREBASE_AUTH.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    await reauthenticateWithCredential(user, credential);
    
    // Delete the user account
    await deleteUser(user);
    
    console.log(`DEBUG: User ${user.uid} deleted successfully`);
  } catch (error) {
    console.error('DEBUG: Error deleting user account:', error);
    throw error;
  }
};

const deleteFirestoreUser = async (userId) => {
  try {
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    const userRoutinesCollectionRef = collection(FIRESTORE_DB, "users", userId, "routines");
    const userSkinAnalysisCollectionRef = collection(FIRESTORE_DB, "users", userId, "skinAnalysisResults");
    const imagesCollectionRef = collection(FIRESTORE_DB, "users", userId, "images");

    // Delete user routines
    const userRoutinesSnapshot = await getDocs(userRoutinesCollectionRef);
    userRoutinesSnapshot.forEach(async (routineDoc) => {
      const routineDocRef = doc(userRoutinesCollectionRef, routineDoc.id);
      await deleteDoc(routineDocRef);
    });

    // Delete user skin analysis results
    const userSkinAnalysisSnapshot = await getDocs(userSkinAnalysisCollectionRef);
    userSkinAnalysisSnapshot.forEach(async (skinAnalysisDoc) => {
      const skinAnalysisDocRef = doc(userSkinAnalysisCollectionRef, skinAnalysisDoc.id);
      await deleteDoc(skinAnalysisDocRef);
    });

    // Delete user images from Firebase Storage
    const imagesSnapshot = await getDocs(imagesCollectionRef);
    imagesSnapshot.forEach(async (imageDoc) => {
      const imageDocRef = doc(imagesCollectionRef, imageDoc.id);
      await deleteDoc(imageDocRef);
    });

    // Delete user document from Firestore
    await deleteDoc(userDocRef);
    
    console.log('DEBUG: Firestore user document deleted successfully');
  } catch (error) {
    console.error('DEBUG: Error deleting Firestore user document:', error);
    throw error;
  }
};

const saveSkinAnalysisResult = async (userId, result) => {
  try {
    // Reference to the user's document in Firestore
    const userDocRef = doc(FIRESTORE_DB, "users", userId);

    // Check if the user document exists
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      throw new Error(`User document with ID ${userId} does not exist.`);
    }

    // Reference to the skin analysis collection
    const skinAnalysisCollectionRef = collection(FIRESTORE_DB, "users", userId, "skinAnalysisResults");

    // Delete the existing skin analysis document if it exists
    const existingAnalysisQuery = query(skinAnalysisCollectionRef);
    const existingAnalysisSnapshot = await getDocs(existingAnalysisQuery);
    existingAnalysisSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log('Existing skin analysis document deleted.');
    });

    // Create a new document for the skin analysis result
    const analysisDocRef = doc(skinAnalysisCollectionRef);

    // Set the document data to the result
    await setDoc(analysisDocRef, result);

    console.log('Skin analysis result saved successfully.');
  } catch (error) {
    console.error('Error saving skin analysis result:', error);
    throw error;
  }
};

const getSkinAnalysisResults = async (userId) => {
  try {
    const skinAnalysisCollectionRef = collection(FIRESTORE_DB, "users", userId, "skinAnalysisResults");
    const skinAnalysisSnapshot = await getDocs(skinAnalysisCollectionRef);
    const skinAnalysisResults = skinAnalysisSnapshot.docs.map(doc => doc.data());
    // console.log("DEBUG: Skin analysis results:", skinAnalysisResults); // Debugging line
    return skinAnalysisResults;
  } catch (error) {
    console.error("Error fetching skin analysis results:", error);
    throw error;
  }
};

export { 
  fetchDailyRoutines, 
  addRoutine, 
  deleteRoutine, 
  updateRoutine, 
  uploadBannerImage, 
  fetchBannerImage, 
  uploadProfileImage, 
  fetchProfileImage,
  updateUsernameInFirestore,
  deleteAuthAccount,
  deleteFirestoreUser,
  saveSkinAnalysisResult,
  getSkinAnalysisResults
};

