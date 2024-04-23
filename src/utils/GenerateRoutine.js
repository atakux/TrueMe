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
  acne: {
    title: "Acne-Fighting Skincare",
    steps: ["Apply an acne treatment to target acne"],
    days: [0, 1, 2, 3, 4, 5, 6],
    stepCompletionStatus: [false],
  },
  bags: {
    title: "Depuffing Skincare",
    steps: ["Use a caffeine-infused eye cream to reduce puffiness"],
    days: [0, 1, 2, 3, 4, 5, 6],
    stepCompletionStatus: [false],
  },
  redness: {
    title: "Calming Skincare",
    steps: ["Use a calming serum to reduce redness"],
    days: [0, 1, 2, 3, 4, 5, 6],
    stepCompletionStatus: [false],
  },
  wrinkles: {
    title: "Anti-Aging Skincare",
    steps: ["Apply a retinol serum to stimulate collagen production"],
    days: [0, 1, 2, 3, 4, 5, 6],
    stepCompletionStatus: [false],
  },
  pores: {
    title: "Pore-Refining Skincare",
    steps: ["Apply a clay mask to absorb excess oil and tighten pores"],
    days: [0, 1, 2, 3, 4, 5, 6],
    stepCompletionStatus: [false],
  },
  darkspots: {
    title: "Brightening Skincare",
    steps: ["Apply a vitamin C serum to brighten skin tone"],
    days: [0, 1, 2, 3, 4, 5, 6],
    stepCompletionStatus: [false],
  },
  puffy_eyes: {
    title: "Eye Care Skincare",
    steps: ["Apply a hydrating eye cream to moisturize the delicate skin around the eyes"],
    days: [0, 1, 2, 3, 4, 5, 6],
    stepCompletionStatus: [false],
  },
};

  
const generateSuggestedSkincareRoutine = async (userSkinType, userSkinConditions) => {
  console.log("DEBUG: userSkinType:", userSkinType);
  console.log("DEBUG: userSkinConditions:", userSkinConditions);

  // Determine the user's skin type based on preferences or analysis
  let selectedSkinType = userSkinType;
  console.log("DEBUG: Selected skin type:", selectedSkinType);

  // Sort conditions by value and select the top 3 conditions equal to or over 0.05
  const sortedConditions = Object.entries(userSkinConditions)
      .filter(([condition, value]) => value >= 0.05 && condition !== "normal" && condition !== "dry" && condition !== "oily")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

  console.log("DEBUG: Sorted conditions:", sortedConditions);

  // Create selectedSkinType based on the top 3 conditions
  for (const [condition, _] of sortedConditions) {
      selectedSkinType += `_${condition}`;
  }

  console.log("DEBUG: Selected skin type after conditions:", selectedSkinType);

  // Select a skincare routine based on the user's skin type
  let suggestedSkincareRoutine = skincareRoutines[selectedSkinType] || skincareRoutines[userSkinType];

  // Merge additional steps from specific skin condition routines and adjust the title
  for (const [condition, _] of sortedConditions) {
      const conditionRoutine = skincareRoutines[condition];
      if (conditionRoutine) {
          suggestedSkincareRoutine = {
              ...suggestedSkincareRoutine,
              steps: [...suggestedSkincareRoutine.steps, ...conditionRoutine.steps],
          };
      }
  }

  console.log("DEBUG: Suggested Skincare Routine:", suggestedSkincareRoutine);


  return suggestedSkincareRoutine;
};

export default generateSuggestedSkincareRoutine;
  