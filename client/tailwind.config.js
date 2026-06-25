/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This is crucial - must be 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C4A484',
          light: '#D2B48C',
          dark: '#8B7355',
          50: '#FDF5E6',
          100: '#FAE8D1',
          200: '#F5D1A3',
          300: '#F0BA75',
          400: '#EBA347',
          500: '#C4A484',
          600: '#8B7355',
          700: '#6B5B45',
          800: '#4B4235',
          900: '#2C1810',
        },
        secondary: {
          DEFAULT: '#8B7355',
          light: '#A0896E',
          dark: '#6B5B45',
        },
        accent: {
          DEFAULT: '#D2B48C',
          light: '#E5D3B3',
          dark: '#C4A484',
        },
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
