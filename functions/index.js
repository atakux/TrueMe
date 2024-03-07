const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.midnightReset = functions.pubsub
    .schedule("0 0 * * *") // Run at midnight every day
    .onRun(async () => {
      const firestore = admin.firestore();
      const usersCollectionRef = firestore.collection("users");

      try {
        // Fetch all users
        const usersSnapshot = await usersCollectionRef.get();
        usersSnapshot.forEach(async (userDoc) => {
          const routinesCollectionRef = userDoc.ref.collection("routines");
          // Fetch all routines for the current user
          const routinesSnapshot = await routinesCollectionRef.get();
          routinesSnapshot.forEach(async (routineDoc) => {
            // Reset the stepCompletionStatus array to all false
            await routineDoc.ref.update({
              // eslint-disable-next-line max-len
              stepCompletionStatus: Array(routineDoc.data().steps.length).fill(false),
            });
          });
        });
        console.log("Step completion status reset successfully.");
      } catch (error) {
        console.error("Error resetting step completion status:", error);
      }
    });
