import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './SearchResults.css';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavOnly, setShowFavOnly] = useState(false);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchRecipes = async () => {
      if (!query) {
        setRecipes([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des recettes');
        }

        const data = await response.json();
        if (!ignore) {
          setRecipes(data.meals || []);
        }
      } catch (err) {
        if (!ignore && err.name !== 'AbortError') {
          setError("Une erreur est survenue. Merci de réessayer.");
          setRecipes([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchRecipes();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavorites(parsed);
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  };

  const filteredRecipes = recipes.filter((meal) => {
    const matchCat = selectedCategory ? meal.strCategory === selectedCategory : true;
    const matchArea = selectedArea ? meal.strArea === selectedArea : true;
    const matchFav = showFavOnly ? favorites.includes(meal.idMeal) : true;
    return matchCat && matchArea && matchFav;
  });

  return (
    <div className="results-page">
      <div className="results-hero">
        <h1 className="results-title">Résultats de recherche</h1>
        <p className="results-subtitle">
          {query ? `Votre requête : "${query}"` : 'Saisissez une recherche pour explorer des recettes'}
        </p>
      </div>

      {loading && (
        <div className="state-message" aria-live="polite">
          <span className="loader" />
          <span>Chargement des recettes…</span>
        </div>
      )}

      {!loading && error && (
        <div className="state-message error" role="alert">{error}</div>
      )}

      {!loading && !error && query && recipes.length === 0 && (
        <div className="state-message">Aucun résultat trouvé pour cette recherche.</div>
      )}

      {!loading && !error && !query && (
        <div className="state-message">Commencez une recherche pour voir les résultats.</div>
      )}

      {!loading && !error && recipes.length > 0 && (
        <>
          <div className="filters-bar">
            <div className="filter-group">
              <label>Catégorie</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Toutes</option>
                {Array.from(new Set(recipes.map(r => r.strCategory).filter(Boolean))).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Origine</label>
              <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                <option value="">Toutes</option>
                {Array.from(new Set(recipes.map(r => r.strArea).filter(Boolean))).map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            <div className="filter-group inline">
              <label>
                <input
                  type="checkbox"
                  checked={showFavOnly}
                  onChange={(e) => setShowFavOnly(e.target.checked)}
                />
                &nbsp;Favoris uniquement
              </label>
            </div>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="state-message">Aucun résultat pour ces filtres.</div>
          ) : (
            <div
              className={
                "results-grid" +
                (filteredRecipes.length === 1
                  ? " single"
                  : filteredRecipes.length === 2
                  ? " two"
                  : filteredRecipes.length === 3
                  ? " three"
                  : "")
              }
            >
              {filteredRecipes.map((meal) => (
                <Link
                  key={meal.idMeal}
                  to={`/recipe/${meal.idMeal}`}
                  className="recipe-card"
                >
                  <button
                    type="button"
                    className={`fav-btn${favorites.includes(meal.idMeal) ? ' active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(meal.idMeal);
                    }}
                    aria-label="Ajouter aux favoris"
                  >
                    {favorites.includes(meal.idMeal) ? '❤' : '♡'}
                  </button>
                  <div className="recipe-info">
                    <h3>{meal.strMeal}</h3>
                    <p className="recipe-meta">{meal.strCategory || 'Sans catégorie'}</p>
                  </div>
                  <div className="recipe-thumb">
                    <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchResults;
