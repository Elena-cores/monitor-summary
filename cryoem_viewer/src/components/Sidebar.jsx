// components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/sidebar.css';

const Sidebar = () => {
    return (
      <div className="sidebar">
        <h2>Navegación</h2>
        <nav>
          <ul>
            <li>
              <Link to="/">CTF</Link>
            </li>
            <li>
              <Link to="/movie">Movie</Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

export default Sidebar;