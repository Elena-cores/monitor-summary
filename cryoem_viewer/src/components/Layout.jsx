import React from 'react';
import Sidebar from './Sidebar';
import { useConfig } from '../contexts/ConfigContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Layout = ({ children, customBar }) => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <div className="app-container">
      <header className='header'>
        <h1>Monitor summary</h1>
        {isAuthenticated && (
          <div className="auth-actions">
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <div className="customize-bar">
            <h3>Select defocus variable to display in Defocus Coverage histogram:&nbsp;</h3>
            { customBar }
          </div>
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
  
export default Layout;