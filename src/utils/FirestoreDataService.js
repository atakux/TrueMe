import { FIRESTORE_DB } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

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
      });
    });

    return routines;
  } catch (error) {
    console.error("DEBUG: Error fetching daily routines:", error);
    throw error;
  }
};

export { fetchDailyRoutines };
