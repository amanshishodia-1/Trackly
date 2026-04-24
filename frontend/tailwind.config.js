/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: "#0F1115",
          hover: "#1A1D24",
          active: "#2D3139",
          border: "#1F2328",
        },
        accent: {
          purple: "#8B5CF6",
          blue: "#3B82F6",
          green: "#10B981",
        },
      },
    },
  },
  plugins: [],
};
