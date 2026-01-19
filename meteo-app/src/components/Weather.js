import { useState, useEffect } from 'react';
import './Weather.css';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour récupérer les données météo
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const city = 'Paris';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Ville introuvable');
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
  }, []); // Tableau vide : exécuté une seule fois au montage

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
        <div className="error"> Erreur : {error}</div>
      </div>
    );
  }

  // Affichage des données météo
  return (
    <div className="weather-card">
      {weatherData && (
        <>
          <div className="weather-header">
            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
              className="weather-icon"
            />
          </div>

          <div className="weather-temp">
            <span className="temp-value">{Math.round(weatherData.main.temp)}°C</span>
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
              <span className="detail-value">{Math.round(weatherData.main.feels_like)}°C</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pression</span>
              <span className="detail-value">{weatherData.main.pressure} hPa</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Weather;
