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
  FaTimes 
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
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        initial={false}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🍪</span>
            <span className="text-xl font-bold text-gray-900">CookieJar</span>
          </Link>
          
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-cookie-brown text-white'
                      : item.highlight
                      ? 'bg-cookie-cream text-cookie-chocolate hover:bg-cookie-brown hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-cookie-brown to-cookie-dark-brown rounded-lg p-4 text-white">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-cookie-cream mb-3">
              Check out our documentation or contact support
            </p>
            <a
              href="#"
              className="inline-block text-sm font-semibold underline hover:text-cookie-cream transition-colors"
            >
              View Guides →
            </a>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

