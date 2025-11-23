/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cookie: {
          brown: '#D4A574',
          'dark-brown': '#8B6F47',
          chocolate: '#5D4E37',
          cream: '#FFF8E7',
          'light-cream': '#F5E6D3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        cookiejar: {
          'primary': '#D4A574',
          'primary-focus': '#8B6F47',
          'primary-content': '#ffffff',
          'secondary': '#5D4E37',
          'secondary-focus': '#4a3d2c',
          'secondary-content': '#ffffff',
          'accent': '#FFF8E7',
          'accent-focus': '#F5E6D3',
          'accent-content': '#5D4E37',
          'neutral': '#3d4451',
          'neutral-focus': '#2a2e37',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#d1d5db',
          'base-content': '#1f2937',
          'info': '#3abff8',
          'success': '#36d399',
          'warning': '#fbbd23',
          'error': '#f87272',
        },
      },
    ],
  },
};

