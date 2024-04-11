// Define a context to store loaded data
import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    dailyRoutines: null,
    bannerImage: null,
    profileImage: null,
    skinAnalysisResults: null,
  });

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
