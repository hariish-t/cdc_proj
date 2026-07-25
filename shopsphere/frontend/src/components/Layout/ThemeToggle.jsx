import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';

/**
 * Theme Toggle Component
 * Beautiful animated switch between light and dark modes
 * Uses Framer Motion for smooth transitions
 */
export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-14 h-14 rounded-xl 
                  glass-card hover:shadow-neon transition-all duration-300 
                  ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {/* Sun Icon (Light Mode) */}
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
          rotate: isDark ? 180 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Sun className="w-6 h-6 text-yellow-500" />
      </motion.div>

      {/* Moon Icon (Dark Mode) */}
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : -180,
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Moon className="w-6 h-6 text-blue-400" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
