import React from 'react';
import SearchBar from './SearchBar';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">MiamMiam</h1>
      <p className="home-subtitle">Trouvez votre prochaine recette parmi des milliers de plats</p>
      <SearchBar />
    </div>
  );
}

export default Home;
