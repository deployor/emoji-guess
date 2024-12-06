module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '480px',
        'md': '768px',
        'lg': '976px',
        'xl': '1440px',
      },
      colors: {
        'dark-bg': '#1e1e1e',
        'neon-purple': '#8b5cf6',
        'neon-blue': '#3b82f6',
        'neon-pink': '#ec4899',
        'neon-green': '#10b981',
        'game-gradient-from': '#0f172a',
        'game-gradient-to': '#1e293b',
        'holiday-red': '#dc2626',
        'holiday-green': '#16a34a',
        'snow': '#f8fafc',
        'christmas-red': '#c41e3a',
        'christmas-green': '#2f5233',
        'holly-green': '#146b3a',
        'candy-red': '#ff0033',
        'gold': '#ffd700',
        'pine': '#2d5a27',
        'cozy-brown': '#862e1b',
        'snow-white': '#f8fafc'
      },
      backgroundImage: {
        'christmas-gradient': 'linear-gradient(to bottom, #146b3a, #1a472a)',
        'candy-gradient': 'linear-gradient(45deg, #c41e3a 0%, #ff0033 100%)',
      },
      fontFamily: {
        'game': ['Righteous', 'sans-serif'],
        'display': ['Bungee', 'cursive'],
        'sans': ['Inter', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 2px #fff, 0 0 4px #8b5cf6' },
          '50%': { textShadow: '0 0 2px #fff, 0 0 4px #ec4899' },
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        snowfall: {
          '0%': { transform: 'translateY(-10vh) translateX(0)' },
          '100%': { transform: 'translateY(100vh) translateX(20px)' }
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'scale': 'scale 2s infinite',
        'snow-slow': 'snowfall 10s linear infinite',
        'snow-medium': 'snowfall 7s linear infinite',
        'snow-fast': 'snowfall 5s linear infinite'
      },
    },
  },
  plugins: [],
}