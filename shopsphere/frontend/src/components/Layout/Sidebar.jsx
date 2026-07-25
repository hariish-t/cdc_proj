import { useEffect } from 'react'; // Added useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart3, 
  FileDown, 
  History,
  X 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Sidebar = ({ isOpen, onClose }) => {
  // --- ESCAPE KEY LOGIC ---
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    // Cleanup listener when sidebar closes or component unmounts
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  // -------------------------

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', description: 'Overview & Analytics' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders', description: 'Manage Orders' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', description: 'Detailed Reports' },
    { icon: History, label: 'Audit Logs', path: '/audit-logs', description: 'Activity History' },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      {/* Overlay - Also closes on click */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[#2B2621]/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed left-0 top-0 h-full w-72 bg-[#FDFCFB] border-r border-[#E8E3DD] z-50 flex flex-col shadow-2xl"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className="p-6 border-b border-[#E8E3DD]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7C6FAA] flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#7C6FAA]">ShopSphere</h2>
                <p className="text-xs text-[#B4ABA5]">Analytics Pro</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#FAF8F5]">
              <X className="w-5 h-5 text-[#706864]" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose} // Closes when you navigate
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#7C6FAA] text-white' : 'hover:bg-[#FAF8F5] text-[#706864]'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
