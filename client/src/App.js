import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import UploadPage from './pages/UploadPage';
import MyFilesPage from './pages/MyFilesPage';
import VerifyPage from './pages/VerifyPage';
import ComparisonPage from './pages/ComparisonPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><div className="spinner-border text-success" /></div>;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route
            path="/dashboard"
            element={<PrivateRoute><DashboardLayout /></PrivateRoute>}
          >
            <Route index element={<DashboardHome />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="files" element={<MyFilesPage />} />
            <Route path="verify" element={<VerifyPage />} />
            <Route path="comparison" element={<ComparisonPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
