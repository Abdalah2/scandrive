/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d8ecff',
          200: '#b5dcff',
          300: '#7fc2ff',
          400: '#4ba0ff',
          500: '#257df0',
          600: '#1c63c4',
          700: '#194f9c',
          800: '#173f79',
          900: '#102b4f',
        },
        accent: {
          50: '#fff8ec',
          100: '#ffedcb',
          200: '#ffd78c',
          300: '#ffbd55',
          400: '#ff9f1c',
          500: '#f08100',
          600: '#c86400',
        },
        success: '#18b47f',
        danger: '#ef4444',
      },
      screens: {
        xs: '420px',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(16, 43, 79, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};