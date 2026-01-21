import { useState } from 'react';

function TodoItem({ todo, onToggle, onSupprimer, onEditer }) {
  const [edition, setEdition] = useState(false);
  const [texteEdition, setTexteEdition] = useState(todo.text);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (texteEdition.trim() !== '') {
      onEditer(todo.id, texteEdition);
      setEdition(false);
    }
  };

  const isEnRetard = () => {
    if (!todo.dateLimite || todo.completed) return false;
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    const dateLimite = new Date(todo.dateLimite);
    return dateLimite < aujourdhui;
  };

  const getCategorieColor = () => {
    switch(todo.categorie) {
      case 'Urgent': 
        return '#d32f2f';
      case 'Travail': 
        return '#000000';
      case 'Personnel': 
        return '#ffffff';
      default: 
        return '#666';
    }
  };

  return (
    <div className="todo-item" style={{ backgroundColor: isEnRetard() ? '#ffebee' : 'transparent' }}>
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {edition ? (
        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', gap: '5px' }}>
          <input 
            type="text"
            value={texteEdition}
            onChange={(e) => setTexteEdition(e.target.value)}
            style={{ flex: 1, padding: '5px' }}
            autoFocus
          />
          <button type="submit">OK</button>
        </form>
      ) : (
        <span 
          style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            flex: 1,
            color: isEnRetard() ? '#d32f2f' : 'inherit'
          }}
          onDoubleClick={() => setEdition(true)}
        >
          {todo.text}
          {todo.categorie && (
            <span style={{ 
              marginLeft: '10px', 
              padding: '2px 8px', 
              fontSize: '11px', 
              backgroundColor: getCategorieColor(), 
              color: todo.categorie === 'Personnel' ? '#000' : '#fff',
              border: todo.categorie === 'Personnel' ? '1px solid #ccc' : 'none',
              borderRadius: '3px' 
            }}>
              {todo.categorie}
            </span>
          )}
          {todo.dateLimite && (
            <span style={{ 
              marginLeft: '10px', 
              fontSize: '12px', 
              color: isEnRetard() ? '#d32f2f' : '#666' 
            }}>
              {new Date(todo.dateLimite).toLocaleDateString('fr-FR')}
            </span>
          )}
        </span>
      )}
      {!edition && (
        <>
          <button onClick={() => setEdition(true)}>Éditer</button>
          <button onClick={() => onSupprimer(todo.id)}>Supprimer</button>
        </>
      )}
    </div>
  );
}

export default TodoItem;