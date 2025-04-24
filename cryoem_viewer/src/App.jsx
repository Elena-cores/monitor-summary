import React from 'react';
import CTFPage from './pages/CTFPage';
import MicrographPage from './pages/MicrographView';
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './contexts/ConfigContext';
import './index.css'  // global format

const App = () => {
  return (
    <Router>
      <ConfigProvider>
        <Layout>
          <Routes>
            <Route path="/ctf" element={<CTFPage />} />
            <Route path="/movie" element={<MicrographPage />} />
          </Routes>
        </Layout>
      </ConfigProvider>
    </Router>
  );

};

export default App;