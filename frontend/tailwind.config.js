import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        night: '#05080F',
        electric: '#4ADEDE',
        fuchsia: '#C084FC',
        lime: '#A3E635',
        slate: {
          850: '#0F172A',
        },
      },
      boxShadow: {
        neon: '0 0 20px rgba(74, 222, 222, 0.45)',
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
      },
    },
  },
  plugins: [forms],
};
