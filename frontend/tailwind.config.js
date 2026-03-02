/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'TT Norms Pro', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg:       '#07080f',
        surface:  '#0c0e18',
        elevated: '#111520',
        card:     '#151929',
        hover:    '#1a2035',
        border:   '#1f2a40',
        border2:  '#28374f',
        txt:      '#dde6f5',
        txt2:     '#6b85a8',
        muted:    '#3d5070',
        accent:   '#4475e3',
        accent2:  '#3360cc',
        good:     '#0fba7d',
        warn:     '#f0a429',
        crit:     '#f04545',
      },
    },
  },
  plugins: [],
}