import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardCoordinator from './pages/DashboardCoordinator';
import DashboardInstructor from './pages/DashboardInstructor';
import StatisticsPage from './pages/StatisticsPage';
import ProposeWorkshopPage from './pages/ProposeWorkshopPage';
import WorkshopDetailPage from './pages/WorkshopDetailPage';
import WorkshopTypesPage from './pages/WorkshopTypesPage';
import ProfilePage from './pages/ProfilePage';

function DashboardRouter() {
  const { isInstructor } = useAuth();
  return isInstructor ? <DashboardInstructor /> : <DashboardCoordinator />;
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-surface-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/propose"
            element={
              <ProtectedRoute>
                <ProposeWorkshopPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workshops/:id"
            element={
              <ProtectedRoute>
                <WorkshopDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/workshop-types" element={<WorkshopTypesPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              style: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
            },
            error: {
              style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
