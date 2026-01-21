import { useState, useEffect, useContext } from 'react';
import './Weather.css';
import './WeatherAnimation.css';
import { addFavoriteToStorage, getFavoritesFromStorage } from './Favorites';
import { TemperatureUnitContext } from '../contexts/TemperatureUnitContext';

function Weather({ city = 'Paris' }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { convertTemp, getUnitSymbol } = useContext(TemperatureUnitContext);

  useEffect(() => {
    // Vérifier si la ville actuelle est dans les favoris (normalized)
    const favorites = getFavoritesFromStorage();
    const normalizedCity = city.toLowerCase().trim();
    setIsFavorite(favorites.includes(normalizedCity));
  }, [city]);

  // Écouter les changements de favoris depuis Favorites
  useEffect(() => {
    const handleFavoritesUpdated = () => {
      const favorites = getFavoritesFromStorage();
      const normalizedCity = city.toLowerCase().trim();
      setIsFavorite(favorites.includes(normalizedCity));
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
  }, [city]);

  useEffect(() => {
    // Fonction pour récupérer les données météo
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Ville "${city}" introuvable. Vérifiez l'orthographe.`);
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]); // Se déclenche à chaque changement de ville

  const handleAddToFavorites = () => {
    addFavoriteToStorage(city);
    setIsFavorite(true);
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  // Fonction pour déterminer la classe d'animation selon la météo
  const getWeatherAnimation = (weatherMain) => {
    const weatherLower = weatherMain.toLowerCase();
    if (weatherLower.includes('rain') || weatherLower.includes('drizzle')) {
      return 'rain';
    }
    if (weatherLower.includes('snow')) {
      return 'snow';
    }
    if (weatherLower.includes('cloud')) {
      return 'clouds';
    }
    if (weatherLower.includes('clear')) {
      return 'clear';
    }
    if (weatherLower.includes('thunder')) {
      return 'thunderstorm';
    }
    if (weatherLower.includes('mist') || weatherLower.includes('fog') || weatherLower.includes('haze')) {
      return 'mist';
    }
    return '';
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="weather-card">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="weather-card">
        <div className="error">Erreur : {error}</div>
      </div>
    );
  }

  // Affichage des données météo
  return (
    <div className="weather-card">
      {weatherData && (
        <>
          {/* Animation basée sur la météo */}
          <div className={`weather-animation ${getWeatherAnimation(weatherData.weather[0].main)}`}></div>
          
          <div className="weather-header">
            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
              className="weather-icon"
            />
          </div>

          <div className="weather-temp">
            <span className="temp-value">{Math.round(convertTemp(weatherData.main.temp))}{getUnitSymbol()}</span>
            <p className="weather-description">{weatherData.weather[0].description}</p>
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-label">Humidité</span>
              <span className="detail-value">{weatherData.main.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Vent</span>
              <span className="detail-value">{weatherData.wind.speed} m/s</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Ressenti</span>
              <span className="detail-value">{Math.round(convertTemp(weatherData.main.feels_like))}{getUnitSymbol()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pression</span>
              <span className="detail-value">{weatherData.main.pressure} hPa</span>
            </div>
          </div>

          <button
            className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
            onClick={handleAddToFavorites}
            disabled={isFavorite}
          >
            {isFavorite ? '★ Déjà en favoris' : '☆ Ajouter aux favoris'}
          </button>
        </>
      )}
    </div>
  );
}

export default Weather;
