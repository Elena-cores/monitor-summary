import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/sidebar.css';

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Leer del localStorage si existe preferencia
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    // Aplicar el modo y guardar preferencia
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li>
            <Link to="/ctf">CTF</Link>
          </li>
          <li>
            <Link to="/movie">MOVIE</Link>
          </li>
          <li>
            <Link to="/coord">COORDINATES</Link>
          </li>
          <li>
            <Link to="/">ALL</Link>
          </li>
        </ul>
      </nav>
      
      <div className="theme-toggle">
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className="toggle-label">
          {darkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>
    </div>
  );
};

export default Sidebar;