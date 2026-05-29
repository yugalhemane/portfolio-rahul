import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#fcf8f8",
        surface: "#fcf8f8",
        primary: "#5e5e5e",
        secondary: "#5f5e5a",
        outline: "#747877",

        luxury: {
          cream: "#fcf8f8",
          pearl: "#ffffff",
          beige: "#f7f3f2",
          silver: "#c4c7c6",
          dark: "#1c1b1b",
        },
      },

      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
      },

      spacing: {
        "stack-lg": "80px",
        "stack-md": "48px",
        "stack-sm": "24px",
      },

      borderRadius: {
        luxury: "20px",
      },

      boxShadow: {
        luxury: "0 4px 24px rgba(0,0,0,0.04)",
      },

      maxWidth: {
        container: "1280px",
      },
    },
  },

  plugins: [],
};

export default config;