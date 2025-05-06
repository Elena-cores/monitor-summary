import React from 'react';
import CTFPage from './pages/CTFPage';
import AllPage from './pages/AllPage';
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { ConfigProvider } from './contexts/ConfigContext';
import './index.css'  // global format

const App = () => {
  return (
    <Router>
      <DataProvider>
        <ConfigProvider>
          <Layout>
            <Routes>
              <Route path="/ctf" element={<CTFPage />} />
              <Route path="/" element={<AllPage />} />
            </Routes>
          </Layout>
        </ConfigProvider>
      </DataProvider>
    </Router>
  );
};

export default App;