import { motion } from 'framer-motion';

/**
 * Loading Spinner Component
 * Beautiful animated loader with multiple variants
 */
export const Loader = ({ size = 'md', variant = 'spinner', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Spinner Variant
  const SpinnerLoader = () => (
    <div className={`spinner ${sizeClasses[size]}`} />
  );

  // Pulse Variant
  const PulseLoader = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-blue-600 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );

  // Bouncing Balls Variant
  const BouncingLoader = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );

  // Select loader variant
  const LoaderComponent = () => {
    switch (variant) {
      case 'pulse':
        return <PulseLoader />;
      case 'bouncing':
        return <BouncingLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  // Full screen loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <LoaderComponent />
          <motion.p
            className="mt-4 text-gray-600 dark:text-gray-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  // Inline loader
  return (
    <div className="flex items-center justify-center p-4">
      <LoaderComponent />
    </div>
  );
};

/**
 * Skeleton Loader for content placeholders
 */
export const SkeletonLoader = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </>
  );
};

/**
 * Card Skeleton Loader
 */
export const CardSkeleton = () => {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="skeleton h-6 w-1/3" />
      <div className="skeleton h-12 w-2/3" />
      <div className="skeleton h-4 w-1/2" />
    </div>
  );
};

export default Loader;
