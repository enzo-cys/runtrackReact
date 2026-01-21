import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="/favicon.ico" alt="Logo" />
        </Link>
        <div className="header-search">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

export default Header;
