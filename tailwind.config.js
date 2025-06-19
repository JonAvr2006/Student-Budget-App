/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primaryGreen: "#4B7153",
          secondaryGreen: "#5A8462",
          darkGreen: "#4B7153",
        }
      },
    },
    plugins: [],
  }