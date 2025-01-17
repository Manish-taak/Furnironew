import type { Config } from "tailwindcss";

const config: Config = {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/swiper/**/*.{js,ts}',
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark_copper: "#B88E2F",
        creambg_1: "#FFF3E3",
        creambg_2: "#FCF8F3",
        creambg_3: "#F9F1E7",
        creambg_4: "#FAF3EA",
        card_bg: "#F4F5F7",
        solid_green: "#2EC1AC",
        solid_orange: "#E97171",
        linear_bg: "#3A3A3A",
        bg_gray: "#898989",
        border_gray: "#9F9F9F"
      },
      screens: {
        tablet: "650px"
      }
    },
  },
  plugins: [],
};
export default config;