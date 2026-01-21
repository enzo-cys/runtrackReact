import './App.css';
import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState(() => {
    const sauvegardes = localStorage.getItem('todos');
    return sauvegardes ? JSON.parse(sauvegardes) : [];
  });
  const [filtre, setFiltre] = useState('toutes');
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function ajouterTodo(text, categorie, dateLimite) {
    const nouveauTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      categorie: categorie,
      dateLimite: dateLimite
    };
    setTodos([...todos, nouveauTodo]);
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const supprimerTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editerTodo = (id, nouveauTexte) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text: nouveauTexte }
        : todo
    ));
  };

  const reorganiserTodos = (nouveauxTodos) => {
    setTodos(nouveauxTodos);
  };

  const getTodosFiltres = () => {
    let todosFiltres = todos;
    
    switch(filtre) {
      case 'actives':
        todosFiltres = todosFiltres.filter(t => !t.completed);
        break;
      case 'terminees':
        todosFiltres = todosFiltres.filter(t => t.completed);
        break;
      default:
        break;
    }
    
    if (recherche.trim() !== '') {
      todosFiltres = todosFiltres.filter(t => 
        t.text.toLowerCase().includes(recherche.toLowerCase())
      );
    }
    
    return todosFiltres;
  };

  const nombreTotal = todos.length;
  const nombreActives = todos.filter(t => !t.completed).length;
  const nombreTerminees = todos.filter(t => t.completed).length;

  const toutSuppimer = () => {
    if (window.confirm('Supprimer toutes les tâches ?')) {
      setTodos([]);
    }
  };

  return (
    <div className='Ma Todolist'>
      <h1>Ma Todolist</h1>
      <TodoForm onAjouter={ajouterTodo} />
      <input 
        type="text" 
        placeholder="Rechercher une tâche..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <div className="stats">
        <p>Total : {nombreTotal}</p>
        <p>Actives : {nombreActives}</p>
        <p>Terminées : {nombreTerminees}</p>
      </div>
      <div className="filtres">
        <button 
          className={filtre === 'toutes' ? 'actif' : ''}
          onClick={() => setFiltre('toutes')}
        >
          Toutes
        </button>
        <button 
          className={filtre === 'actives' ? 'actif' : ''}
          onClick={() => setFiltre('actives')}
        >
          Actives
        </button>
        <button 
          className={filtre === 'terminees' ? 'actif' : ''}
          onClick={() => setFiltre('terminees')}
        >
          Terminées
        </button>
      </div>
      <TodoList todos={getTodosFiltres()} onToggle={toggleTodo} onSupprimer={supprimerTodo} onEditer={editerTodo} onReorganiser={reorganiserTodos} />
      <button onClick={toutSuppimer}>Tout supprimer</button>
    </div>
  );
}

export default App;
