import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Custom hook to use theme context
 * Provides easy access to theme state and toggle function
 * 
 * @returns {Object} Theme context value with theme, isDark, toggleTheme
 * @throws {Error} If used outside ThemeProvider
 * 
 * Usage:
 * const { theme, isDark, toggleTheme } = useTheme();
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default useTheme;
