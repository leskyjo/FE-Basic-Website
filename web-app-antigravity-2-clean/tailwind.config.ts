import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Cyberpunk Theme - Pure Black + Deep Crimson Red
        'cyber-black': {
          DEFAULT: '#000000',
          light: '#0A0A0A',
          lighter: '#111111',
        },
        'cyber-red': {
          DEFAULT: '#E10600',
          light: '#FF1A0F',
          dark: '#B30500',
          glow: '#E10600',
        },
        'cyber-gray': {
          DEFAULT: '#6B6F76',
          light: '#8A8F98',
          dark: '#5A5E66',
        },
        'cyber-text': {
          DEFAULT: '#EDEDED',
          secondary: '#9CA0A8',
          dim: '#5A5E66',
        },
      },
      boxShadow: {
        'glow-red': '0 0 24px rgba(225, 6, 0, 0.25)',
        'glow-red-lg': '0 0 32px rgba(225, 6, 0, 0.4)',
        'glow-red-xl': '0 0 48px rgba(225, 6, 0, 0.6)',
        'inner-glow-red': 'inset 0 0 20px rgba(225, 6, 0, 0.2)',
        'glass': '0 8px 32px 0 rgba(225, 6, 0, 0.1)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 51, 102, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 0, 68, 0.8)',
          },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '41.99%': { opacity: '1' },
          '42%': { opacity: '0' },
          '43%': { opacity: '0' },
          '43.01%': { opacity: '1' },
          '47.99%': { opacity: '1' },
          '48%': { opacity: '0' },
          '49%': { opacity: '0' },
          '49.01%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(255, 51, 102, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 51, 102, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
};
export default config;
