// RoutineContext.js
import React, { createContext, useContext } from 'react';

const RoutineContext = createContext();

export const useRoutineContext = () => useContext(RoutineContext);

export const RoutineProvider = ({ children, updateDailyRoutines }) => (
  <RoutineContext.Provider value={{ updateDailyRoutines }}>
    {children}
  </RoutineContext.Provider>
);
