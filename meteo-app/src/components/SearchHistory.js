import { useState, useEffect } from 'react';
import './SearchHistory.css';

function capitalizeCity(city) {
  return city.charAt(0).toUpperCase() + city.slice(1);
}

function SearchHistory({ onSelectCity }) {
  const [history, setHistory] = useState([]);

  // Au montage : récupérer l'historique depuis localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Erreur en lisant l\'historique', err);
      }
    }
  }, []);

  // Écouter les mises à jour de l'historique
  useEffect(() => {
    const handleHistoryUpdated = () => {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (err) {
          console.error('Erreur en lisant l\'historique', err);
        }
      }
    };

    window.addEventListener('historyUpdated', handleHistoryUpdated);
    return () => window.removeEventListener('historyUpdated', handleHistoryUpdated);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    setHistory([]);
  };

  return (
    <div className="search-history-section">
      <div className="history-header">
        <h3>Historique de recherche</h3>
        {history.length > 0 && (
          <button className="clear-history-btn" onClick={clearHistory}>
            Effacer
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="no-history">Aucune recherche pour le moment</p>
      ) : (
        <div className="history-list">
          {history.map((city) => (
            <button
              key={city}
              className="history-item"
              onClick={() => onSelectCity(city)}
              title={`Charger la météo de ${capitalizeCity(city)}`}
            >
              {capitalizeCity(city)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchHistory;

// Exporter les fonctions utilitaires
export function getHistoryFromStorage() {
  const saved = localStorage.getItem('searchHistory');
  return saved ? JSON.parse(saved) : [];
}

export function addToHistory(city) {
  const normalizedCity = city.toLowerCase().trim();
  let history = getHistoryFromStorage();

  // Enlever la ville si elle existe déjà (pour la remettre en première position)
  history = history.filter((item) => item !== normalizedCity);

  // Ajouter la ville en début de liste
  history.unshift(normalizedCity);

  // Garder seulement les 5 dernières
  history = history.slice(0, 5);

  localStorage.setItem('searchHistory', JSON.stringify(history));
}
