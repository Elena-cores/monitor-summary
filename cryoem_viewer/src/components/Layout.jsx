import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
         <header className='header'>
            <h1>Monitor summary</h1>
          </header>
          <div className="customize-bar">
            <h1>------- custom bar -------</h1>
          </div>
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