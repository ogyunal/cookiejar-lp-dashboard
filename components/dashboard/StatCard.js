import { motion } from 'framer-motion';

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'blue',
  loading = false 
}) {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      ring: 'ring-blue-100',
    },
    green: {
      gradient: 'from-green-500 via-green-600 to-green-700',
      bg: 'bg-green-50',
      text: 'text-green-600',
      ring: 'ring-green-100',
    },
    purple: {
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      ring: 'ring-purple-100',
    },
    orange: {
      gradient: 'from-orange-500 via-orange-600 to-orange-700',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      ring: 'ring-orange-100',
    },
    pink: {
      gradient: 'from-pink-500 via-pink-600 to-pink-700',
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      ring: 'ring-pink-100',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      className="group relative bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/60"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity`} />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{title}</p>
            {loading ? (
              <div className="h-9 w-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            ) : (
              <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {value}
              </p>
            )}
          </div>
          
          <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-${color}-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
            {icon}
          </div>
        </div>
        
        {trend && trendValue && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              trend === 'up' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <span className="text-sm">{trend === 'up' ? '↑' : '↓'}</span>
              <span>{trendValue}</span>
            </div>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        )}
      </div>
      
      {/* Bottom shine effect */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

