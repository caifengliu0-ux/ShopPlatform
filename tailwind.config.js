

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',
        secondary: 'rgba(55, 67, 106, 0.38)',
        accent: 'rgba(8, 13, 30, 0.9)',
        'text-primary': 'rgba(8, 13, 30, 0.9)',
        'text-secondary': 'rgba(55, 67, 106, 0.6)',
        'border-light': 'rgba(55, 67, 106, 0.1)',
        'bg-hover': 'rgba(55, 67, 106, 0.05)'
      },
      boxShadow: {
        'minimal': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)'
      }
    }
  },
  plugins: [],
}

