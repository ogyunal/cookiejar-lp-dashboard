import { motion } from 'framer-motion';
import { FaGamepad, FaRedoAlt, FaHeart } from 'react-icons/fa';

const features = [
  {
    icon: <FaGamepad />,
    title: 'Instant Play',
    description: 'No downloads, no waiting. Just swipe and play amazing games instantly.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: <FaRedoAlt />,
    title: 'Endless Discovery',
    description: 'Infinite feed of unique games. There\'s always something new to play.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: <FaHeart />,
    title: 'Support Creators',
    description: 'Play, like, and support indie developers from around the world.',
    color: 'from-pink-500 to-pink-600',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Gaming, <span className="text-cookie-brown">Reimagined</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience mobile gaming like never before with our innovative platform
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card-custom text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-3xl shadow-lg`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

