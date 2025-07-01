import React from 'react';
import CTFPage from './pages/CTFPage';
import AllPage from './pages/AllPage';
import ConfigPage from './pages/ConfigPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import CTFCustomBar from './components/CTFCustomBar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { useAuth } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';
import PrivateRoute from './components/PrivateRoute';
import './index.css'  // global format

const App = () => {
  // Import the user and isLoading from AuthContext
  const { user, isLoading } = useAuth();
  const defocusParameters = ['DefocusU', 'DefocusV'];

  // If the authentication state is still loading, show the loading message
  if (isLoading) return <p>Loading...</p>;

  return (
    <Router>
      <DataProvider>
        <ConfigProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
              <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />

              {/* Protected routes */}
              <Route path="/" element={<PrivateRoute><CTFPage /></PrivateRoute>} />
              <Route path="/ctf" element={<PrivateRoute><CTFPage /></PrivateRoute>} />
              <Route path="/all" element={<PrivateRoute><AllPage /></PrivateRoute>} />
              <Route path="/config" element={<PrivateRoute><ConfigPage /></PrivateRoute>} />
            </Routes>
          </Layout>
        </ConfigProvider>
      </DataProvider>
    </Router>
  );
};

export default App;