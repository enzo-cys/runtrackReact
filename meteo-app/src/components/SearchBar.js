import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (city.trim()) {
      onSearch(city.trim());
      setCity(''); // Réinitialiser le champ après la recherche
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Rechercher une ville..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Rechercher
      </button>
    </div>
  );
}

export default SearchBar;
