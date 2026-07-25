import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated Counter Component
 * Smoothly animates number changes
 * Simplified version compatible with React 19
 */
export const AnimatedCounter = ({ 
  value, 
  duration = 1000, 
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const startValue = displayValue;
    const endValue = value || 0;
    const startTime = Date.now();
    const animationDuration = duration;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / animationDuration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      setDisplayValue(currentValue);

      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };

    countRef.current = requestAnimationFrame(animate);

    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [value, duration]);

  const formattedValue = displayValue.toFixed(decimals);
  const displayText = `${prefix}${Number(formattedValue).toLocaleString('en-IN')}${suffix}`;

  return (
    <motion.span
      className={`count-up ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  );
};

/**
 * Percentage Change Indicator
 * Shows percentage change with up/down arrow and color coding
 */
export const PercentageIndicator = ({ value, className = '' }) => {
  const isPositive = value >= 0;
  const color = isPositive 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';

  return (
    <motion.div
      className={`flex items-center gap-1 ${color} ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        animate={{
          rotate: isPositive ? 0 : 180,
        }}
        transition={{ duration: 0.3 }}
      >
        <path
          fillRule="evenodd"
          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </motion.svg>
      <span className="font-semibold text-sm">
        {Math.abs(value).toFixed(1)}%
      </span>
    </motion.div>
  );
};

export default AnimatedCounter;
