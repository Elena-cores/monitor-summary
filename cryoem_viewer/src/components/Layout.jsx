import React from 'react';
import Sidebar from './Sidebar';
import { useConfig } from '../contexts/ConfigContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import CTFCustomBar from './CTFCustomBar';

const Layout = ({ children, customBar }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  return (
    <div className="app-container">
      <header className='header'>
        <h1>Monitor summary</h1>
        {/* Show the logout button only if we are not loading and we are authenticated */}
        {!isLoading && isAuthenticated && (
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
          {!isLoading && isAuthenticated && (
            <div className="customize-bar">
              <h3>Select defocus variable to display in Defocus Coverage histogram:&nbsp;</h3>
              <CTFCustomBar options={['DefocusU', 'DefocusV']} />
            </div>
          )}
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;