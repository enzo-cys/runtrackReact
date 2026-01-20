import { useState, useEffect } from 'react';
import './Favorites.css';

// Fonction helper pour capitaliser la première lettre
function capitalizeCity(city) {
  return city.charAt(0).toUpperCase() + city.slice(1);
}

function Favorites({ onSelectCity, currentCity }) {
  const [favorites, setFavorites] = useState([]);

  // Au montage : récupérer les favoris depuis localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (err) {
        console.error('Erreur en lisant les favoris', err);
      }
    }
  }, []);

  // Écouter les mises à jour de favoris depuis Weather
  useEffect(() => {
    const handleFavoritesUpdated = () => {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (err) {
          console.error('Erreur en lisant les favoris', err);
        }
      }
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
  }, []);

  // Fonction pour supprimer une ville des favoris
  const removeFromFavorites = (city) => {
    const newFavorites = favorites.filter((fav) => fav !== city);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    // Déclencher l'événement pour que Weather recheck le status
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  return (
    <div className="favorites-section">
      <h3>Villes favorites</h3>
      {favorites.length === 0 ? (
        <p className="no-favorites">Aucune ville favorite pour le moment</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((city) => (
            <div key={city} className="favorite-item">
              <button
                className="favorite-city-btn"
                onClick={() => onSelectCity(city)}
              >
                {capitalizeCity(city)}
              </button>
              <button
                className="remove-btn"
                onClick={() => removeFromFavorites(city)}
                title="Supprimer des favoris"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;

// Fonction helper pour normaliser une ville
function normalizeCity(city) {
  return city.toLowerCase().trim()
}

// Exporter les fonctions utilitaires pour utilisation externe
export function getFavoritesFromStorage() {
  const saved = localStorage.getItem('favorites');
  return saved ? JSON.parse(saved) : [];
}

export function addFavoriteToStorage(city) {
  const normalizedCity = normalizeCity(city);
  const favorites = getFavoritesFromStorage();
  if (!favorites.includes(normalizedCity)) {
    favorites.push(normalizedCity);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}
