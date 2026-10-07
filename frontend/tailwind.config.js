/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        canvas: '#F4F5F7',
        ink: '#1C2430',
        muted: '#667085',
        line: '#E2E5EA',
        brand: { DEFAULT: '#2B5C7F', dark: '#214A66', soft: '#E8F0F6' },
        danger: { DEFAULT: '#B42318', soft: '#FDECEA' },
      },
    },
  },
  plugins: [],
};
