import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        wagmi: {
          primary: "#020227",
          "primary-content": "#F5F5F5",
          secondary: "#FDDE00",
          "secondary-content": "#161200",
          accent: "#00ffff",
          "accent-content": "#001616",
          neutral: "#ffe4e6",
          "neutral-content": "#161213",
          "base-100": "#020227",
          "base-200": "#010120",
          "base-300": "#01011a",
          "base-content": "#F5F5F5",
          info: "#0000ff",
          "info-content": "#c6dbff",
          success: "#00ff00",
          "success-content": "#001600",
          warning: "#00ff00",
          "warning-content": "#001600",
          error: "#ff0000",
          "error-content": "#160000",
        },
      },
    ],
  },
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
