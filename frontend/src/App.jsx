import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CompanyDetail from './pages/CompanyDetail';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import AptitudeRound from './pages/AptitudeRound';
import CodingRound from './pages/CodingRound';
import TechnicalRound from './pages/TechnicalRound';
import HRRound from './pages/HRRound';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppLayout = ({ children, showNav = true }) => (
  <div className="min-h-screen bg-dark-900">
    {showNav && <Navbar />}
    <main>{children}</main>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<AppLayout showNav={false}><LandingPage /></AppLayout>} />
      <Route path="/login" element={<PublicRoute><AppLayout showNav={false}><LoginPage /></AppLayout></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><AppLayout showNav={false}><SignupPage /></AppLayout></PublicRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/company/:companyName" element={<ProtectedRoute><AppLayout><CompanyDetail /></AppLayout></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><AppLayout><ResumeAnalyzer /></AppLayout></ProtectedRoute>} />
      <Route path="/aptitude/:companyName" element={<ProtectedRoute><AppLayout><AptitudeRound /></AppLayout></ProtectedRoute>} />
      <Route path="/coding/:companyName" element={<ProtectedRoute><AppLayout><CodingRound /></AppLayout></ProtectedRoute>} />
      <Route path="/technical/:companyName" element={<ProtectedRoute><AppLayout><TechnicalRound /></AppLayout></ProtectedRoute>} />
      <Route path="/hr/:companyName" element={<ProtectedRoute><AppLayout><HRRound /></AppLayout></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
