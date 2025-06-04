/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path if your components are elsewhere
    "./public/index.html"         // If you use classes directly in your main HTML
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

