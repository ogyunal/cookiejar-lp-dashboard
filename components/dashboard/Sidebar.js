import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaGamepad, 
  FaPlus, 
  FaChartBar, 
  FaDollarSign, 
  FaCog, 
  FaBook,
  FaTimes,
  FaQuestionCircle 
} from 'react-icons/fa';

const menuItems = [
  { 
    icon: <FaChartLine />, 
    label: 'Dashboard', 
    href: '/dashboard/overview' 
  },
  { 
    icon: <FaGamepad />, 
    label: 'My Games', 
    href: '/dashboard/games' 
  },
  { 
    icon: <FaPlus />, 
    label: 'Upload Game', 
    href: '/dashboard/upload',
    highlight: true 
  },
  { 
    icon: <FaChartBar />, 
    label: 'Analytics', 
    href: '/dashboard/analytics' 
  },
  { 
    icon: <FaDollarSign />, 
    label: 'Earnings', 
    href: '/dashboard/earnings' 
  },
  { 
    icon: <FaCog />, 
    label: 'Settings', 
    href: '/dashboard/settings' 
  },
  { 
    icon: <FaBook />, 
    label: 'Documentation', 
    href: '#',
    external: true 
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();

  const isActive = (href) => {
    return router.pathname === href;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/60 flex flex-col shadow-xl lg:shadow-none transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        initial={false}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200/60">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🍪</span>
            <span className="text-lg font-bold bg-gradient-to-r from-cookie-brown to-cookie-dark-brown bg-clip-text text-transparent">CookieJar</span>
          </Link>
          
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const active = isActive(item.href);
              return (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative overflow-hidden ${
                      active
                        ? 'bg-gradient-to-r from-cookie-brown to-cookie-dark-brown text-white shadow-lg shadow-cookie-brown/30'
                        : item.highlight
                        ? 'bg-gradient-to-r from-cookie-cream to-cookie-light hover:from-cookie-brown hover:to-cookie-dark-brown text-cookie-chocolate hover:text-white hover:shadow-md'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                    }`}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                  >
                    {active && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`text-base relative z-10 ${active ? '' : 'group-hover:scale-110 transition-transform'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm relative z-10">{item.label}</span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>
        
        {/* Bottom section */}
        <div className="p-3 border-t border-gray-200/60">
          <div className="bg-gradient-to-br from-cookie-brown via-cookie-dark-brown to-cookie-chocolate rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <FaQuestionCircle className="text-cookie-cream" />
                <h3 className="font-bold text-sm">Need Help?</h3>
              </div>
              <p className="text-xs text-cookie-cream/90 mb-3 leading-relaxed">
                Check out our documentation or contact support
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-xs font-semibold hover:gap-2 transition-all group"
              >
                <span>View Guides</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

