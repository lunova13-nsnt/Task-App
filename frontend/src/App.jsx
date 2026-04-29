import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A1F',
              color: '#fff',
              border: '1px solid #32323C',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#5FA888', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#E87070', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <p className="font-display font-bold text-6xl text-ink-700 mb-4">404</p>
                  <p className="text-ink-500 font-body mb-6">Page not found</p>
                  <a href="/dashboard" className="btn-primary inline-block">Go Home</a>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
