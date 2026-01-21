import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error('Réponse API non valide');
        }
        const data = await response.json();
        const found = data.meals && data.meals.length ? data.meals[0] : null;
        if (!ignore) {
          setMeal(found);
          setLoading(false);
          if (!found) {
            setError('Recette introuvable.');
          }
        }
      } catch (err) {
        if (!ignore && err.name !== 'AbortError') {
          setError('Une erreur est survenue. Merci de réessayer.');
          setMeal(null);
          setLoading(false);
        }
      }
    };

    fetchDetail();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id]);

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

  const toggleFavorite = (mealId) => {
    setFavorites((prev) => {
      const exists = prev.includes(mealId);
      const next = exists ? prev.filter((x) => x !== mealId) : [...prev, mealId];
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: meal?.strMeal, url });
      } catch (e) {
        /* ignore cancel */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papier');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getIngredients = (mealData) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = mealData[`strIngredient${i}`];
      const measure = mealData[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        const qty = measure && measure.trim() ? measure.trim() : '';
        ingredients.push(`${qty} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-state">
          <span className="loader" /> Chargement de la recette…
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="detail-page">
        <div className="detail-state error" role="alert">{error || 'Recette introuvable.'}</div>
        <button className="back-btn" onClick={handleBack}>Retour aux résultats</button>
      </div>
    );
  }

  const ingredients = getIngredients(meal);

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={handleBack}>Retour aux résultats</button>

      <div className="detail-header">
        <div className="detail-text">
          <h1>{meal.strMeal}</h1>
          <div className="detail-actions">
            <button
              className={`fav-btn${favorites.includes(meal.idMeal) ? ' active' : ''}`}
              onClick={() => toggleFavorite(meal.idMeal)}
            >
              {favorites.includes(meal.idMeal) ? '❤ Favori' : '♡ Ajouter aux favoris'}
            </button>
            <button className="ghost-btn" onClick={handleShare}>Partager</button>
            <button className="ghost-btn" onClick={handlePrint}>Imprimer</button>
          </div>
          <p className="detail-meta">Catégorie : {meal.strCategory || 'N/A'}</p>
          <p className="detail-meta">Origine : {meal.strArea || 'N/A'}</p>
        </div>
        <div className="detail-image">
          <img src={meal.strMealThumb} alt={meal.strMeal} />
        </div>
      </div>

      <section className="detail-section">
        <h2>Ingrédients</h2>
        <div className="ingredients-grid">
          {ingredients.length === 0 && <p>Aucun ingrédient listé.</p>}
          {ingredients.map((item, idx) => (
            <div className="ingredient-item" key={idx}>{item}</div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h2>Instructions</h2>
        <p className="instructions">{meal.strInstructions || 'Aucune instruction disponible.'}</p>
      </section>
    </div>
  );
}

export default RecipeDetail;
