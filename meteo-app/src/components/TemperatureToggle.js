import { useContext } from 'react';
import { TemperatureUnitContext } from '../contexts/TemperatureUnitContext';
import './TemperatureToggle.css';

function TemperatureToggle() {
  const { isCelsius, toggleUnit } = useContext(TemperatureUnitContext);

  return (
    <button 
      className="temperature-toggle" 
      onClick={toggleUnit}
      title={`Basculer vers ${isCelsius ? 'Fahrenheit' : 'Celsius'}`}
    >
      <span className={isCelsius ? 'active' : ''}>°C</span>
      <span className="separator">|</span>
      <span className={!isCelsius ? 'active' : ''}>°F</span>
    </button>
  );
}

export default TemperatureToggle;
