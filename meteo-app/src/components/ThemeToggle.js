import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="theme-toggle" onClick={toggleTheme} title={isDarkMode ? 'Mode clair' : 'Mode sombre'}>
      {isDarkMode ? 'Clair' : 'Sombre'}
    </button>
  );
}

export default ThemeToggle;
