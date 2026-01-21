import { useState } from 'react';

function TodoForm({ onAjouter }) {
  const [inputValue, setInputValue] = useState('');
  const [categorie, setCategorie] = useState('Personnel');
  const [dateLimite, setDateLimite] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    onAjouter(inputValue, categorie, dateLimite);
    setInputValue('');
    setDateLimite('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Ajouter une nouvelle tâche..."
      />
      <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
        <option value="Personnel">Personnel</option>
        <option value="Travail">Travail</option>
        <option value="Urgent">Urgent</option>
      </select>
      <input 
        type="date" 
        value={dateLimite} 
        onChange={(e) => setDateLimite(e.target.value)}
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default TodoForm;