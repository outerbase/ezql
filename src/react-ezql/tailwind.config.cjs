/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          primary: {
            400: "#834FF8",
            500: "#A27BFA",
            600: "#C1A7FC",
            700: "#E0D3FD",
          },
          feedback: {
            success: "#32D583",
            warning: "#FDB022",
            error: "#F0384E",
          },
          gray: {
            100: "#FFFFFF",
            200: "#F9F9F9",
            300: "#EEEEEE",
            400: "#D0D0D0",
            500: "#959497",
            600: "#5E5D61",
            700: "#343438",
            800: "#05040D",
          },
        },
        dark: {
          primary: {
            400: "#834FF8",
            500: "#633CBD",
            600: "#442982",
            700: "#2F1D5B",
          },
          feedback: {
            success: "#32D583",
            warning: "#FDB022",
            error: "#F0384E",
          },

          gray: {
            100: "#05040D",
            200: "#121119",
            300: "#1E1F24",
            400: "#343438",
            500: "#5E5D61",
            600: "#959497",
            700: "#C0C0C0",
            800: "#FFFFFF",
          },
        },
        canonical: {
          purple: "#6B57E8",
          yellow: "#FBE67F",
          orange: "#F09252;",
          red: "#EB4E43",
          blue: "#70B6F9",
          pink: "#E4AEFA",
          green: "#79E2BE",
          ycombinator: "#FB651E",
        },
      },
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ["Helvetica", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
}
