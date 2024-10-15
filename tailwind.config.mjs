/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui";
import typography from "@tailwindcss/typography";
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Titillium Web", "sans-serif"],
        serif: ["Lora", "serif"],
      },
    },
  },
  daisyui: {
    // Add your daisy ui themes here
    themes: [
      {
        italia: {
          "color-scheme": "light",
          primary: "#0066CC",
          "primary-content": "#fff",

          secondary: "#5D7083",
          "secondary-focus": "#bd0091",
          "secondary-content": "#fff",

          accent: "#0158B3",
          "accent-focus": "#F2F7FC",
          "accent-content": "#fff",

          neutral: "#262626",
          "neutral-focus": "#5c6f82",
          "neutral-content": "#fff",

          "base-100": "#fff",
          "base-200": "#F2F7FC",
          "base-300": "#f8f8f8",
          "base-content": "#1f1f1f",

          info: "#0066CC",
          success: "#008055",
          warning: "#CC7A00",
          error: "#CC334D",
        },
      },
      "dracula",
    ],
  },
  plugins: [daisyui, typography],
};
