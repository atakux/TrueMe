// GenerateRoutine.js

const skincareRoutines = {
    drySkin: {
      title: "Hydrating Skincare",
      steps: ["Cleanse with a gentle hydrating cleanser", "Apply a hydrating toner", "Use a rich moisturizer", "Apply a facial oil for extra hydration", "Finish with a sunscreen in the morning"],
      days: [0, 1, 2, 3, 4, 5, 6],
      stepCompletionStatus: [false, false, false, false, false, false, false],
    },
    oilySkin: {
      title: "Balancing Skincare",
      steps: ["Cleanse with a foaming cleanser to remove excess oil", "Apply a gentle exfoliating toner to unclog pores", "Use an oil-free moisturizer", "Apply a mattifying sunscreen in the morning"],
      days: [0, 1, 2, 3, 4, 5, 6],
      stepCompletionStatus: [false, false, false, false, false, false, false],
    },
    normal: {
      title: "Basic Skincare",
      steps: ["Cleanse with a gentle cleanser", "Apply a gentle exfoliating toner", "Use a rich moisturizer", "Apply a facial oil for extra hydration", "Finish with a sunscreen in the morning"],
      days: [0, 1, 2, 3, 4, 5, 6],
      stepCompletionStatus: [false, false, false, false, false, false, false],
    },
    combination: {
      title: "Combination Skincare",
      steps: ["Cleanse with a gentle cleanser", "Apply a gentle exfoliating toner", "Use a rich moisturizer", "Apply a facial oil for extra hydration", "Finish with a sunscreen in the morning"],
      days: [0, 1, 2, 3, 4, 5, 6],
      stepCompletionStatus: [false, false, false, false, false, false, false],
    },
  };
  
  const generateSuggestedSkincareRoutine = (userSkinType) => {
    // Determine the user's skin type based on preferences or analysis
    if (userSkinType) {
      const selectedSkinType = userSkinType.toLowerCase();
    }
  
    // Select a skincare routine based on the user's skin type
    const suggestedSkincareRoutine = skincareRoutines[selectedSkinType] || skincareRoutines.normal;
  
    return suggestedSkincareRoutine;
  };
  
  export default generateSuggestedSkincareRoutine;
  