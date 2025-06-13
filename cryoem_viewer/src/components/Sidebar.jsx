import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/sidebar.css';

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode based on user's saved preference in localStorage
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    // Apply or remove dark mode class on body, and persist preference to localStorage
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
          {/*  Future navigation links can be added here as new pages are implemented */}
          {/* 
           <li>
            <Link to="/movie">MOVIE</Link>
          </li>
          <li>
            <Link to="/coord">COORDINATES</Link>
          </li>
          */}
         
          <li>
            <Link to="/all">ALL</Link>
          </li>
          <li>
            <Link to="/config">CONFIGURE</Link>
          </li>
        </ul>
      </nav>
      
      {/* Theme toggle switch for dark/light mode */}
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