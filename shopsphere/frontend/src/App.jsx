import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HeroSection from './pages/Home';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Shared Components
import ErrorBoundary from './components/Shared/ErrorBoundary';
import Loader from './components/Shared/Loader';

// Hooks
import useAuth from './hooks/useAuth';

/**
 * Protected Route Component
 * Improved to prevent "eager" redirection to login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // 1. If we are still checking the token, show the loader
  if (loading) {
    return <Loader fullScreen variant="bouncing" />;
  }

  // 2. ONLY redirect if loading is finished AND we are definitely not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Main Layout Component
 * Fixed layout structure to prevent Sidebar/Navbar overlapping
 */
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FDFCFB] dark:bg-dark-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Content Area */}
      <div className="flex flex-col flex-1 w-full overflow-y-auto overflow-x-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

/**
 * App Router Component
 */
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard is wrapped in both Protection and Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};



/**
 * Main App Component
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'glass-card',
                style: {
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
              }}
            />
            <AppRouter />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
