import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import Link from 'next/link';

export default function TopBar({ onMenuClick }) {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Your game "Epic Adventure" was approved!', time: '2 hours ago', unread: true },
    { id: 2, text: 'You earned $50 from plays this week', time: '1 day ago', unread: true },
    { id: 3, text: 'New analytics features available', time: '2 days ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100/80 transition-all active:scale-95"
        >
          <FaBars className="text-gray-600 text-sm" />
        </button>
        
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Creator Dashboard</h1>
        </div>
      </div>
      
      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100/80 transition-all active:scale-95 group"
          >
            <FaBell className="text-gray-600 text-sm group-hover:text-cookie-brown transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notifications dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-cookie-brown/10 text-cookie-brown font-semibold px-2 py-1 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 border-b border-gray-100/60 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white cursor-pointer transition-all group ${
                          notification.unread ? 'bg-cookie-cream/10' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${notification.unread ? 'bg-cookie-brown' : 'bg-gray-300'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 mb-1 group-hover:text-cookie-brown transition-colors">
                              {notification.text}
                            </p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-gray-50 to-white text-center border-t border-gray-100">
                    <a href="#" className="text-xs text-cookie-brown hover:text-cookie-dark-brown font-semibold transition-colors inline-flex items-center gap-1 group">
                      <span>View all notifications</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </a>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100/80 transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cookie-brown via-cookie-dark-brown to-cookie-chocolate rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cookie-brown/20 ring-2 ring-white group-hover:ring-cookie-cream transition-all">
              {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-[10px] text-gray-500 leading-tight">Creator</p>
            </div>
          </button>
          
          {/* User dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <motion.div
                  className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cookie-brown via-cookie-dark-brown to-cookie-chocolate rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-cookie-brown/20">
                        {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">
                          {session?.user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session?.user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1.5">
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white text-gray-700 hover:text-cookie-brown transition-all group"
                    >
                      <FaUser className="text-sm" />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                    
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white text-gray-700 hover:text-cookie-brown transition-all group"
                    >
                      <FaCog className="text-sm" />
                      <span className="text-sm font-medium">Settings</span>
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-200/60 py-1.5 bg-gradient-to-r from-red-50/50 to-white">
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all w-full group"
                    >
                      <FaSignOutAlt className="text-sm group-hover:translate-x-0.5 transition-transform" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

