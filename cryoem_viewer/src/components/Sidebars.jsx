// components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/sidebar.css';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <ul className='nav-links'>
                <li>
                    <Link to="/">CTF</Link>
                </li>
                <li>
                    <Link to="/list">Micrograph</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;