import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ startsWith: [], contains: [] });
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

  const filterSuggestions = (meals, q) => {
    if (!meals) return { startsWith: [], contains: [] };
    const lowerQuery = q.toLowerCase();
    const startsWith = meals.filter(meal => meal.strMeal.toLowerCase().startsWith(lowerQuery));
    const contains = meals.filter(meal => {
      const name = meal.strMeal.toLowerCase();
      return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
    });
    return {
      startsWith: startsWith.slice(0, 5),
      contains: contains.slice(0, 5)
    };
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      const term = query.trim();
      if (term.length < 2) {
        setSuggestions({ startsWith: [], contains: [] });
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`);
        const data = await res.json();
        const meals = data.meals || [];
        const grouped = filterSuggestions(meals, term);
        setSuggestions(grouped);
        const hasAny = grouped.startsWith.length + grouped.contains.length > 0;
        setShowSuggestions(hasAny);
      } catch (err) {
        setSuggestions({ startsWith: [], contains: [] });
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
          onFocus={() => (suggestions.startsWith.length + suggestions.contains.length) > 0 && setShowSuggestions(true)}
        />
        <button type="submit">Rechercher</button>
      </form>

      {showSuggestions && (suggestions.startsWith.length > 0 || suggestions.contains.length > 0) && (
        <div className="suggestions" role="listbox">
          {suggestions.startsWith.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-label">Commencent par "{query}"</div>
              {suggestions.startsWith.map((meal) => (
                <button
                  key={`sw-${meal.idMeal}`}
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

          {suggestions.startsWith.length > 0 && suggestions.contains.length > 0 && (
            <div className="suggestions-separator" />
          )}

          {suggestions.contains.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-label alt">Autres résultats</div>
              {suggestions.contains.map((meal) => (
                <button
                  key={`ct-${meal.idMeal}`}
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
      )}
    </div>
  );
}

export default SearchBar;
