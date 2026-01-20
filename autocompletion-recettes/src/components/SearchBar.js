import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (value) => {
    setQuery(value);
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      const term = query.trim();
      if (term.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`);
        const data = await res.json();
        const meals = data.meals || [];
        const limited = meals.slice(0, 10);
        setSuggestions(limited);
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-wrapper">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Rechercher une recette..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        <button type="submit">Rechercher</button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((meal) => (
            <button
              key={meal.idMeal}
              type="button"
              className="suggestion-item"
              onClick={() => handleSelect(meal.strMeal)}
            >
              <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
              <div className="suggestion-text">
                <span className="suggestion-title">{meal.strMeal}</span>
                <span className="suggestion-meta">{meal.strCategory || 'Recette'}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
