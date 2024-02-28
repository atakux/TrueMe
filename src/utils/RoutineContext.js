import React, { createContext, useContext } from 'react';

const RoutineContext = createContext();

export const useRoutineContext = () => useContext(RoutineContext);

// Provides updateDailyRoutines function to HomeScreen and AddRoutine screens 
// to update daily routines dynamically
export const RoutineProvider = ({ children, updateDailyRoutines }) => (
  <RoutineContext.Provider value={{ updateDailyRoutines }}>
    {children}
  </RoutineContext.Provider>
);
