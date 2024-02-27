import { FIRESTORE_DB } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const fetchDailyRoutines = async (uid) => {
  try {
    const routineRef = collection(FIRESTORE_DB, "users", uid, "routines");
    const snapshot = await getDocs(routineRef);
    const routines = [];

    snapshot.forEach((doc) => {
      routines.push({
        id: doc.id,
        title: doc.data().title,
      });
    });

    return routines;
  } catch (error) {
    console.error("Error fetching daily routines:", error);
    throw error;
  }
};

export { fetchDailyRoutines };
