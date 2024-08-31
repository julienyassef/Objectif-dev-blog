/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FCCD00',
        secondaire :'#A3BAC3',
        terciaire :'#335C67',
        colorModal: '#1F2938',
        colorBg :'#A24936',
        colorInput:'#9CA3AF'
      },
      boxShadow: {
        'custom-light': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 2px 4px rgba(0, 0, 0, 0.9)',
      },
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
