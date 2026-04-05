import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardCoordinator from './pages/DashboardCoordinator';
import DashboardInstructor from './pages/DashboardInstructor';
import StatisticsPage from './pages/StatisticsPage';

function DashboardRouter() {
  const { isInstructor } = useAuth();
  return isInstructor ? <DashboardInstructor /> : <DashboardCoordinator />;
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

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
    <>
      <Navbar />
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-surface-900 text-white/60 text-center py-3 text-xs">
        Developed by FOSSEE group, IIT Bombay
      </footer>
    </>
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
