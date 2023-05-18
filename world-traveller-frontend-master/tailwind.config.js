// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#646CFF",
        "base-bg": "#F6F7FB",
      },
    },
  },
  variants: {
    extend: {
      lineClamp: ["hover"],
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")],
};
