import { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import Weather from './components/Weather';

function App() {
  const [searchedCity, setSearchedCity] = useState('Paris');

  const handleSearch = (city) => {
    setSearchedCity(city);
  };

  return (
    <main className="app-shell">
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
        <Weather city={searchedCity} />
      </section>
    </main>
  );
}

export default App;
