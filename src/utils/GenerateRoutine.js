// GenerateRoutine.js

const skincareRoutines = {
    dry: {
      title: "Hydrating Skincare",
      steps: ["Cleanse with a gentle hydrating cleanser", "Apply a hydrating toner", "Use a rich moisturizer", "Apply a facial oil for extra hydration", "Finish with a sunscreen in the morning"],
      days: [0, 1, 2, 3, 4, 5, 6],
      stepCompletionStatus: [false, false, false, false, false],
    },
    oily: {
      title: "Balancing Skincare",
      steps: ["Cleanse with a foaming cleanser to remove excess oil", "Apply a gentle exfoliating toner to unclog pores", "Use an oil-free moisturizer", "Apply a mattifying sunscreen in the morning"],
      days: [0, 1, 2, 3, 4, 5, 6],
      stepCompletionStatus: [false, false, false, false],
    },
    normal: {
      title: "Basic Skincare",
      steps: ["Cleanse with a gentle cleanser", "Apply a gentle exfoliating toner", "Use a rich moisturizer", "Apply a facial oil for extra hydration", "Finish with a sunscreen in the morning"],
      days: [0, 1, 2, 3, 4, 5, 6],
      stepCompletionStatus: [false, false, false, false, false],
    },
    combination: {
      title: "Combination Skincare",
      steps: ["Cleanse with a gentle cleanser", "Apply a gentle exfoliating toner", "Use a rich moisturizer", "Apply a facial oil for extra hydration", "Finish with a sunscreen in the morning"],
      days: [0, 1, 2, 3, 4, 5, 6],
      stepCompletionStatus: [false, false, false, false, false],
    },
  };
  
  const generateSuggestedSkincareRoutine = async (userSkinType) => {
    console.log("DEBUG: userSkinType:", userSkinType);
    // Determine the user's skin type based on preferences or analysis
    const selectedSkinType = userSkinType;
    console.log("DEBUG: Selected skin type:", selectedSkinType);
  
    // Select a skincare routine based on the user's skin type
    const suggestedSkincareRoutine = skincareRoutines[selectedSkinType];
  
    return suggestedSkincareRoutine;
  };
  
  export default generateSuggestedSkincareRoutine;
  