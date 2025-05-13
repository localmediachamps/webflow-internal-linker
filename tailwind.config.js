/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#d6e0fd',
          300: '#b3c7fc',
          400: '#89a5f9',
          500: '#6080f6',
          600: '#3d5cec',
          700: '#2e47d9',
          800: '#2939b0',
          900: '#283381',
          950: '#1a2056',
        },
      },
    },
  },
  plugins: [],
}; 