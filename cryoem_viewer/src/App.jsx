import React from 'react';
import CTFPage from './pages/CTFView';
import MicrographPage from './pages/MicrographView'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  // return <CTFPage />;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CTFPage />} />
        <Route path="/list" element={<MicrographPage />} />
      </Routes>
    </Router>
  )
  
};

export default App;