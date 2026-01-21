import { useState } from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onSupprimer, onEditer, onReorganiser }) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex) => {
    if (draggedIndex === null) return;
    
    const newTodos = [...todos];
    const draggedItem = newTodos[draggedIndex];
    newTodos.splice(draggedIndex, 1);
    newTodos.splice(dropIndex, 0, draggedItem);
    
    onReorganiser(newTodos);
    setDraggedIndex(null);
  };

  return (
    <div className="todolist-container">
      {todos.length === 0 && <p>Aucune tâche. Ajoute-en une !</p>}
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          style={{ cursor: 'move' }}
        >
          <TodoItem 
            todo={todo}
            onToggle={onToggle}
            onSupprimer={onSupprimer}
            onEditer={onEditer}
          />
        </div>
      ))}
    </div>
  );
}

export default TodoList;