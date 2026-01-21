import { createContext, useState, useEffect } from 'react';

export const TemperatureUnitContext = createContext();

export function TemperatureUnitProvider({ children }) {
  const [isCelsius, setIsCelsius] = useState(() => {
    const savedUnit = localStorage.getItem('temperatureUnit');
    return savedUnit ? savedUnit === 'celsius' : true;
  });

  useEffect(() => {
    localStorage.setItem('temperatureUnit', isCelsius ? 'celsius' : 'fahrenheit');
  }, [isCelsius]);

  const toggleUnit = () => {
    setIsCelsius(prev => !prev);
  };

  const convertTemp = (celsius) => {
    return isCelsius ? celsius : (celsius * 9/5) + 32;
  };

  const getUnitSymbol = () => {
    return isCelsius ? '°C' : '°F';
  };

  return (
    <TemperatureUnitContext.Provider value={{ isCelsius, toggleUnit, convertTemp, getUnitSymbol }}>
      {children}
    </TemperatureUnitContext.Provider>
  );
}
