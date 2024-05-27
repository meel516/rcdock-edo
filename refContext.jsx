import React, { useContext, createContext, useRef } from 'react';
export const refContext = createContext();
export const RefProvider = ({ children }) => {
  const mainref = useRef(null);
  return <refContext.Provider value={mainref}>{children}</refContext.Provider>;
};
