import { FIRESTORE_DB } from "../../firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";

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
      // Update routine document in Firestore
      await updateDoc(doc(FIRESTORE_DB, "users", userId, "routines", routineId), 
          {
              title: updatedRoutine.title,
              days: updatedRoutine.days,
              steps: updatedRoutine.steps
          }
      );
      console.log(`DEBUG: Routine with ID ${routineId} updated with data ${JSON.stringify(updatedRoutine)}`);
  } catch (error) {
      console.error("DEBUG: Error updating routine:", error);
      throw error;
  }
}

export { fetchDailyRoutines, addRoutine, deleteRoutine, updateRoutine };
