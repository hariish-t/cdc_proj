import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, User, LogOut, Settings, Menu, Package, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const notifications = [
    { id: 1, title: 'New order received', message: 'Order #12345 from John Doe', time: '2m ago' },
    { id: 2, title: 'Payment confirmed', message: 'Payment of ₹5,400 received', time: '1h ago' },
    { id: 3, title: 'Stock alert', message: 'Running low on inventory', time: '3h ago' },
  ];

  return (
    <motion.nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white border-b border-[#E8E4F3] shadow-sm' 
          : 'bg-white/95 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left Side */}
          <div className="flex items-center gap-6">
            
            {/* Mobile Menu */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-xl hover:bg-[#F5F3FA] transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-[#3D3B42]" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E8E4F3] flex items-center justify-center">
                <Package className="w-6 h-6 text-[#9B8FC7]" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[#3D3B42]">ShopSphere</h1>
                <p className="text-xs text-[#6B6773] font-medium">Analytics Dashboard</p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F5E9] border border-[#D4EDD6]">
              <Circle className={`w-2 h-2 ${connected ? 'fill-[#7CB87D] text-[#7CB87D]' : 'fill-[#D4A5A5] text-[#D4A5A5]'}`} />
              <span className="text-xs font-semibold text-[#3D3B42]">
                {connected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#F5F3FA] border border-[#E8E4F3] hover:border-[#9B8FC7] focus-within:border-[#9B8FC7] transition-colors">
              <Search className="w-5 h-5 text-[#6B6773]" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                className="flex-1 bg-transparent text-sm text-[#3D3B42] placeholder:text-[#6B6773] outline-none"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 rounded-2xl hover:bg-[#F5F3FA] transition-colors relative"
              >
                <Bell className="w-6 h-6 text-[#6B6773]" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#E89E6C] rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    
                    <motion.div
                      className="absolute right-0 mt-3 w-80 bg-white border border-[#E8E4F3] rounded-3xl shadow-xl overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-5 bg-[#F5F3FA] border-b border-[#E8E4F3]">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-[#3D3B42]">Notifications</h3>
                          <span className="px-3 py-1 text-xs font-semibold text-white bg-[#9B8FC7] rounded-full">
                            {notifications.length}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-4 rounded-2xl hover:bg-[#F5F3FA] transition-colors cursor-pointer"
                          >
                            <p className="font-semibold text-[#3D3B42] text-sm mb-1">{notif.title}</p>
                            <p className="text-xs text-[#6B6773] mb-2">{notif.message}</p>
                            <p className="text-xs text-[#9B8FC7] font-medium">{notif.time}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-[#F5F3FA] border-t border-[#E8E4F3]">
                        <button className="w-full py-3 text-sm font-semibold text-[#9B8FC7] hover:bg-white rounded-xl transition-colors">
                          View All
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-[#F5F3FA] transition-colors border border-[#E8E4F3]"
              >
                <div className="w-10 h-10 rounded-full bg-[#9B8FC7] flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-[#3D3B42]">{user?.name}</p>
                  <p className="text-xs text-[#6B6773] capitalize">{user?.role}</p>
                </div>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    
                    <motion.div
                      className="absolute right-0 mt-3 w-72 bg-white border border-[#E8E4F3] rounded-3xl shadow-xl overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Header */}
                      <div className="p-6 bg-[#F5F3FA] border-b border-[#E8E4F3]">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-14 h-14 rounded-2xl bg-[#9B8FC7] flex items-center justify-center text-white font-bold text-xl">
                            {getInitials(user?.name)}
                          </div>
                          <div>
                            <p className="font-bold text-[#3D3B42] text-lg">{user?.name}</p>
                            <p className="text-sm text-[#6B6773]">{user?.email}</p>
                          </div>
                        </div>
                        <div className="px-3 py-2 rounded-xl bg-white border border-[#E8E4F3]">
                          <span className="text-xs font-semibold text-[#9B8FC7] capitalize">{user?.role}</span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-3 space-y-1">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#F5F3FA] transition-colors text-left">
                          <div className="w-10 h-10 rounded-xl bg-[#E8E4F3] flex items-center justify-center">
                            <User className="w-5 h-5 text-[#9B8FC7]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#3D3B42]">Profile</p>
                            <p className="text-xs text-[#6B6773]">View your profile</p>
                          </div>
                        </button>

                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#F5F3FA] transition-colors text-left">
                          <div className="w-10 h-10 rounded-xl bg-[#E8E4F3] flex items-center justify-center">
                            <Settings className="w-5 h-5 text-[#9B8FC7]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#3D3B42]">Settings</p>
                            <p className="text-xs text-[#6B6773]">Preferences</p>
                          </div>
                        </button>

                        <div className="my-2 border-t border-[#E8E4F3]" />

                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#FCE8E8] transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#FCE8E8] flex items-center justify-center">
                            <LogOut className="w-5 h-5 text-[#D4A5A5]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#D4A5A5]">Sign Out</p>
                            <p className="text-xs text-[#D4A5A5] opacity-70">See you soon</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
