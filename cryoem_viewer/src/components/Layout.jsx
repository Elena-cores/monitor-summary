import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <header className='header'>
        <h1>Monitor summary</h1>
      </header>
      
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <div className="customize-bar">
            <h1>------- custom bar -------</h1>
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