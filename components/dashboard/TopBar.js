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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaBars className="text-gray-700" />
        </button>
        
        <div>
          <h1 className="text-xl font-bold text-gray-900">Creator Dashboard</h1>
        </div>
      </div>
      
      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaBell className="text-gray-700 text-lg" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs text-cookie-brown font-semibold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? 'bg-cookie-cream/20' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900 mb-1">
                          {notification.text}
                        </p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-gray-50 text-center">
                    <a href="#" className="text-sm text-cookie-brown hover:text-cookie-dark-brown font-semibold">
                      View all notifications
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cookie-brown to-cookie-dark-brown rounded-full flex items-center justify-center text-white font-bold">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500">Creator</p>
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
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-bold text-gray-900">
                      {session?.user?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session?.user?.email || 'user@example.com'}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <FaUser />
                      <span>Profile</span>
                    </Link>
                    
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <FaCog />
                      <span>Settings</span>
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors w-full"
                    >
                      <FaSignOutAlt />
                      <span>Sign Out</span>
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

