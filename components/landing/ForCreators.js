import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { FaChartLine, FaDollarSign, FaUsers } from 'react-icons/fa';

const benefits = [
  {
    icon: <FaChartLine />,
    title: 'Real-time Analytics',
    description: 'Track plays, engagement, and retention in real-time',
  },
  {
    icon: <FaDollarSign />,
    title: 'Earn from Plays',
    description: 'Revenue sharing based on play time and engagement',
  },
  {
    icon: <FaUsers />,
    title: 'Global Audience',
    description: 'Reach millions of players on iOS and Android',
  },
];

export default function ForCreators() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Built for <span className="text-cookie-brown">Creators</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              Got a game? Share it with millions. Upload your Godot games, track analytics, and earn from plays.
            </p>
            
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-cookie-brown text-white rounded-lg flex items-center justify-center text-xl">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={() => {
                  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
                  window.location.href = isLocalhost 
                    ? 'http://localhost:3000/auth/signin'
                    : 'https://creator.thecookiejar.app/auth/signin';
                }}
              >
                Start Creating
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right side - Stats/Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-cookie-brown to-cookie-dark-brown rounded-3xl p-8 text-white shadow-2xl">
              <div className="space-y-8">
                <div>
                  <div className="text-5xl font-bold mb-2">10,000+</div>
                  <div className="text-cookie-cream text-lg">Games Published</div>
                </div>
                
                <div>
                  <div className="text-5xl font-bold mb-2">500K+</div>
                  <div className="text-cookie-cream text-lg">Monthly Players</div>
                </div>
                
                <div>
                  <div className="text-5xl font-bold mb-2">$50K+</div>
                  <div className="text-cookie-cream text-lg">Paid to Creators This Month</div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-cookie-cream/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cookie-cream/20 rounded-full blur-xl" />
            </div>
            
            {/* Floating card */}
            <motion.div
              className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl max-w-xs"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg" />
                <div>
                  <div className="font-bold text-gray-900">Your Game</div>
                  <div className="text-sm text-gray-500">Just published</div>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <div className="font-bold text-gray-900">1,234</div>
                  <div className="text-gray-500">Plays</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">$123</div>
                  <div className="text-gray-500">Earned</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

