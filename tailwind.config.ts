import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          night: "#050b14",
          deep: "#0a1322",
          neon: "#3ba6ff",
          silver: "#cfd5df"
        }
      },
      boxShadow: {
        glow: "0 20px 40px rgba(10, 95, 190, 0.35)",
        neon: "0 15px 32px rgba(20, 105, 195, 0.55)"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(-12px,-18px,0)" }
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(24px)" }
        },
        pulseGlow: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.2)", opacity: "0.7" }
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" }
        }
      },
      animation: {
        drift: "drift 16s linear infinite",
        floaty: "floaty 14s ease-in-out infinite",
        "floaty-slow": "floaty 18s ease-in-out infinite reverse",
        pulseGlow: "pulseGlow 8s ease-in-out infinite",
        blink: "blink 1s steps(2, start) infinite"
      }
    }
  },
  plugins: []
};

export default config;
