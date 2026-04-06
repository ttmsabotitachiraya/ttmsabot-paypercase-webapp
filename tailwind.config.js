/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yogurt:    '#F4F7FA',
        blueberry: '#3F51B5',
        whipped:   '#9FA8DA',
        crust:     '#FFAB91',
        darkberry: '#1A237E',
      },
      fontFamily: {
        tahoma: ['Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
