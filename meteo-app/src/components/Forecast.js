import { useState, useEffect, useContext } from 'react';
import './Forecast.css';
import { TemperatureUnitContext } from '../contexts/TemperatureUnitContext';

function Forecast({ city = 'Paris' }) {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { convertTemp, getUnitSymbol } = useContext(TemperatureUnitContext);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        // L'API forecast retourne les prévisions toutes les 3 heures sur 5 jours
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Impossible de récupérer les prévisions pour "${city}"`);
        }

        const data = await response.json();
        
        // Filtrer pour obtenir une prévision par jour (vers 12h00)
        const dailyForecasts = data.list.filter(item => 
          item.dt_txt.includes('12:00:00')
        );
        
        setForecastData(dailyForecasts.slice(0, 5)); // Garder 5 jours
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return <div className="forecast-loading">Chargement des prévisions...</div>;
  }

  if (error) {
    return <div className="forecast-error">{error}</div>;
  }

  return (
    <div className="forecast-container">
      <h3>Prévisions sur 5 jours</h3>
      <div className="forecast-grid">
        {forecastData && forecastData.map((day, index) => (
          <div key={index} className="forecast-day">
            <p className="forecast-date">{formatDate(day.dt_txt)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
              className="forecast-icon"
            />
            <p className="forecast-temp">{Math.round(convertTemp(day.main.temp))}{getUnitSymbol()}</p>
            <p className="forecast-desc">{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
