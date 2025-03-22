import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <header className="header">
            <h1>Monitor summary</h1>
          </header>
          <main>
            {children}
          </main>
          <footer>
            © 2025 Mi Aplicación Monitor Summary
          </footer>
        </div>
      </div>
    );
};
  
export default Layout;