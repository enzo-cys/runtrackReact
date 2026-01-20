
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Route de recherche à compléter plus tard */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
