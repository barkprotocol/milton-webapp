import animatePlugin from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Enables dark mode based on a class
  content: [
    './pages/**/*.{ts,tsx}', // Ensure all your pages are included
    './components/**/*.{ts,tsx}', // Ensure all your components are included
    './app/**/*.{ts,tsx}', // If using app directory in Next.js
    './src/**/*.{ts,tsx}', // If your source files are under src
  ],
  theme: {
    container: {
      center: true, // Centers the container
      padding: "2rem", // Adds padding
      screens: {
        "2xl": "1400px", // Custom screen size for 2xl
      },
    },
    extend: {
      colors: {
        // Using CSS variables for colors, ensure they are defined
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Other color settings...
      },
      borderRadius: {
        lg: "var(--radius)", // Custom radius settings
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Ensure Poppins is imported
        heading: ['Oswald', 'sans-serif'], // Ensure Oswald is imported
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animatePlugin], // Adding tailwindcss-animate plugin
}