import { FIRESTORE_DB } from "../../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

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

export { fetchDailyRoutines, deleteRoutine };
