import React from 'react';
import CTFPage from './pages/CTFView';
import MicrographPage from './pages/MicrographView'
import Layout from './components/Layout'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'  // global format

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CTFPage />} />
          <Route path="/list" element={<MicrographPage />} />
        </Routes>
      </Layout>
    </Router>
  );

};

export default App;