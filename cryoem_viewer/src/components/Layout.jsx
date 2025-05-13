import React from 'react';
import Sidebar from './Sidebar';
import { useConfig } from '../contexts/ConfigContext';

const Layout = ({ children, customBar }) => {
  return (
    <div className="app-container">
      <header className='header'>
        <h1>Monitor summary</h1>
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