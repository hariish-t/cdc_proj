import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to use authentication context
 * Provides easy access to auth state and functions throughout the app
 * 
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside AuthProvider
 * 
 * Usage:
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;
