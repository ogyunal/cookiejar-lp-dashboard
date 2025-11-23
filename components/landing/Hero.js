import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden cookie-jar-pattern">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cookie-cream/50 to-white" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 text-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Bite-Sized Games.{' '}
              <span className="text-cookie-brown">Endless Fun.</span>
            </motion.h1>
            
            <motion.p
              className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Swipe, play, discover. The TikTok of mobile gaming.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                icon={<FaApple className="text-2xl" />}
                className="min-w-[200px]"
              >
                App Store
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={<FaGooglePlay className="text-2xl" />}
                className="min-w-[200px]"
              >
                Google Play
              </Button>
            </motion.div>
            
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <a
                href="/auth/signin"
                className="text-cookie-chocolate hover:text-cookie-brown font-semibold underline transition-colors"
              >
                I'm a Creator →
              </a>
            </motion.div>
          </motion.div>
          
          {/* Right side - Phone mockup */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full max-w-sm animate-float">
              {/* Phone frame */}
              <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                  {/* Mock app interface */}
                  <div className="w-full h-full bg-gradient-to-br from-cookie-cream to-white flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🍪</div>
                      <div className="text-2xl font-bold text-cookie-brown mb-2">CookieJar</div>
                      <div className="text-sm text-gray-600">Swipe to play games</div>
                      
                      {/* Mock game cards */}
                      <div className="mt-8 space-y-4">
                        <div className="bg-white rounded-2xl p-4 shadow-lg">
                          <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mb-2" />
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">Epic Adventure</div>
                            <div className="text-xs text-gray-500">2.5k plays</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-gray-900 rounded-b-2xl" />
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-3xl">🎮</div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="text-3xl">❤️</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="text-cookie-brown text-sm font-semibold">
          Scroll to explore ↓
        </div>
      </motion.div>
    </section>
  );
}

