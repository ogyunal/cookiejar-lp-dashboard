import { motion } from 'framer-motion';
import { FaDownload, FaHandPointer, FaPlay } from 'react-icons/fa';

const steps = [
  {
    icon: <FaDownload />,
    title: 'Download CookieJar',
    description: 'Get the app from App Store or Google Play',
    color: 'bg-blue-500',
  },
  {
    icon: <FaHandPointer />,
    title: 'Swipe Through Games',
    description: 'Discover amazing games in your personalized feed',
    color: 'bg-purple-500',
  },
  {
    icon: <FaPlay />,
    title: 'Play Instantly',
    description: 'Tap to play any game immediately, no downloads needed',
    color: 'bg-pink-500',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-cookie-cream to-cookie-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It <span className="text-cookie-brown">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start playing in three simple steps
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-cookie-brown/20 transform -translate-y-1/2" />
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center relative z-10">
                  {/* Step number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-cookie-brown text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-3xl shadow-lg`}>
                    {step.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

