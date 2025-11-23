import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  icon = null,
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-cookie-brown hover:bg-cookie-dark-brown text-white shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed',
    secondary: 'bg-white hover:bg-cookie-cream text-cookie-chocolate border-2 border-cookie-brown disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed',
    ghost: 'bg-transparent hover:bg-cookie-cream text-cookie-chocolate disabled:text-gray-400 disabled:cursor-not-allowed',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}

