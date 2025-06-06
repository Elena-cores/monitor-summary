import React from 'react';
import CTFPage from './pages/CTFPage';
import AllPage from './pages/AllPage';
import ConfigPage from './pages/ConfigPage';
import Layout from './components/Layout';
import CTFCustomBar from './components/CTFCustomBar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { ConfigProvider } from './contexts/ConfigContext';
import './index.css'  // global format

const App = () => {
  // custom bar options
  // <Route path="/config" element={<ConfigPage />} />
  const defocusParameters = ['DefocusU', 'DefocusV'];

  return (
    <Router>
      <DataProvider>
        <ConfigProvider>
          <Layout customBar={<CTFCustomBar options={defocusParameters} />}>
            <Routes>
              <Route path="/ctf" element={<CTFPage />} />
              <Route path="/" element={<AllPage />} />
              <Route path="/config" element={<ConfigPage />} />
            </Routes>
          </Layout>
        </ConfigProvider>
      </DataProvider>
    </Router>
  );
};

export default App;