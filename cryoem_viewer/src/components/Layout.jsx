import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
         <div className='header'>
            <h1>Monitor summary</h1>
         </div>
          <header className="customize-bar">
            <h1> custom bar</h1>
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