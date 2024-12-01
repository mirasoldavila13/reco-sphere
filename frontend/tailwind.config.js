import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        recosphere: {
          primary: "#E50914",
          secondary: "#B81D24",
          accent: "#B3B3B3",
          neutral: "#141414",
          "base-100": "#141414",
          "--btn-text-primary": "#FFFFFF",
          "--btn-hover-text-primary": "#FFFFFF",
          "--btn-bg-primary": "#E50914",
          "--btn-hover-bg-primary": "#B81D24",
        },
      },
    ],
  },
};
