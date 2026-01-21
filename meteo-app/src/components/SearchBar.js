import { useState } from 'react';
import './SearchBar.css';
import { addToHistory } from './SearchHistory';

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

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

  // Fonction de géolocalisation
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=fr`;
          
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.name) {
            addToHistory(data.name);
            window.dispatchEvent(new CustomEvent('historyUpdated'));
            onSearch(data.name);
          }
        } catch (err) {
          alert('Erreur lors de la récupération de votre position.');
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        alert('Impossible d\'obtenir votre position. Veuillez vérifier les autorisations.');
        setLoadingLocation(false);
      }
    );
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
      <button 
        onClick={handleGeolocation} 
        className="location-button"
        disabled={loadingLocation}
      >
        {loadingLocation ? 'Recherche...' : 'Ma position'}
      </button>
    </div>
  );
}

export default SearchBar;
