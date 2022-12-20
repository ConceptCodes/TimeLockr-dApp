/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-teal": "#B2ECE1",
        "custom-purple": "#ADB2D3",
        "custom-blue": "#65AFFF",
        "custom-green": "#CFD186",
        background: "#1E1E1E",
      },
    },
  },
  plugins: [],
};
