import { useState } from 'react';
import './SearchBar.css';
import { addToHistory } from './SearchHistory';

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (city.trim()) {
      const trimmedCity = city.trim();
      addToHistory(trimmedCity); // Ajouter à l'historique
      window.dispatchEvent(new CustomEvent('historyUpdated')); // Notifier les composants
      onSearch(trimmedCity);
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
