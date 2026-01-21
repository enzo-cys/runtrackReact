import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './SearchResults.css';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        <div
          className={
            "results-grid" +
            (recipes.length === 1
              ? " single"
              : recipes.length === 2
              ? " two"
              : recipes.length === 3
              ? " three"
              : "")
          }
        >
          {recipes.map((meal) => (
            <Link
              key={meal.idMeal}
              to={`/recipe/${meal.idMeal}`}
              className="recipe-card"
            >
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
    </div>
  );
}

export default SearchResults;
