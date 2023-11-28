/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBackgroundColor: "#0D1117",
        columnBackgroundColor: "#161C22",
      },
      fontFamily: {
        mono: ["Share Tech Mono", "monospace"],
        rem: ["REM", "sans-serif"],
      },
      backgroundImage: {
        office: "url('backgrounds/benjamin-child-office.jpg')",
      },
    },
  },
  plugins: [],
};
