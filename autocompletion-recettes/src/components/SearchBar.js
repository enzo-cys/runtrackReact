import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ startsWith: [], contains: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Aplatir les suggestions pour la navigation
  const allSuggestions = [...suggestions.startsWith, ...suggestions.contains];

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
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || allSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, allSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(allSuggestions[selectedIndex].strMeal);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
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
        setLoading(false);
        return;
      }

      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selectedIndex quand suggestions changent
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher une recette..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => (suggestions.startsWith.length + suggestions.contains.length) > 0 && setShowSuggestions(true)}
          />
          {loading && <span className="loader-icon" />}
        </div>
        <button type="submit">Rechercher</button>
      </form>

      {showSuggestions && (suggestions.startsWith.length > 0 || suggestions.contains.length > 0) && (
        <div className="suggestions" role="listbox">
          {suggestions.startsWith.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-label">Commencent par "{query}"</div>
              {suggestions.startsWith.map((meal, idx) => {
                const globalIdx = idx;
                return (
                  <button
                    key={`sw-${meal.idMeal}`}
                    type="button"
                    className={`suggestion-item${selectedIndex === globalIdx ? ' active' : ''}`}
                    onClick={() => handleSelect(meal.strMeal)}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                  >
                    <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
                    <div className="suggestion-text">
                      <span className="suggestion-title">{meal.strMeal}</span>
                      <span className="suggestion-meta">{meal.strCategory || 'Recette'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {suggestions.startsWith.length > 0 && suggestions.contains.length > 0 && (
            <div className="suggestions-separator" />
          )}

          {suggestions.contains.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-label alt">Autres résultats</div>
              {suggestions.contains.map((meal, idx) => {
                const globalIdx = suggestions.startsWith.length + idx;
                return (
                  <button
                    key={`ct-${meal.idMeal}`}
                    type="button"
                    className={`suggestion-item${selectedIndex === globalIdx ? ' active' : ''}`}
                    onClick={() => handleSelect(meal.strMeal)}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                  >
                    <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
                    <div className="suggestion-text">
                      <span className="suggestion-title">{meal.strMeal}</span>
                      <span className="suggestion-meta">{meal.strCategory || 'Recette'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
