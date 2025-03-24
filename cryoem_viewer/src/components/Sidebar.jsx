// components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/sidebar.css';
import logo from '../assets/logo.png';

const Sidebar = () => {
    return (
      <div className="sidebar">
        <div className="sidebar-header"> 
        </div>
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
      </div>
    );
  };

export default Sidebar;