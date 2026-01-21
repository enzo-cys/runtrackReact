import { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import Weather from './components/Weather';
import Favorites from './components/Favorites';
import SearchHistory from './components/SearchHistory';
import Forecast from './components/Forecast';
import ThemeToggle from './components/ThemeToggle';
import TemperatureToggle from './components/TemperatureToggle';

function App() {
  const [searchedCity, setSearchedCity] = useState('Paris');

  const handleSearch = (city) => {
    setSearchedCity(city);
  };

  const handleSelectFavorite = (city) => {
    setSearchedCity(city);
  };

  const handleSelectHistory = (city) => {
    setSearchedCity(city);
  };

  return (
    <main className="app-shell">
      {/* Boutons de toggle flottants */}
      <ThemeToggle />
      <TemperatureToggle />
      
      <section className="app-header">
        <p className="eyebrow">Application météo</p>
        <h1>Météo</h1>
        <p className="lede">
          Recherchez une ville, consultez les conditions actuelles et gardez vos
          favoris sous la main.
        </p>
      </section>

      <section className="weather-section">
        <SearchBar onSearch={handleSearch} />
      </section>

      <div className="main-container">
        <div className="weather-left">
          <Weather city={searchedCity} />
          <Forecast city={searchedCity} />
        </div>

        <div className="sidebar-right">
          <Favorites onSelectCity={handleSelectFavorite} currentCity={searchedCity} />
          <SearchHistory onSelectCity={handleSelectHistory} />
        </div>
      </div>
    </main>
  );
}

export default App;
