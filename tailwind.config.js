/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ニュートラルを温かみのある石灰系（warm stone）に置換 → 全体が上質な紙の質感に
        neutral: {
          50: "#faf9f7",
          100: "#f4f2ee",
          200: "#e8e4dd",
          300: "#d6cfc4",
          400: "#a8a096",
          500: "#79716a",
          600: "#57514b",
          700: "#423d39",
          800: "#2a2723",
          900: "#1a1815",
          950: "#0e0d0b",
        },
        // アクセントは落ち着いたディープインディゴ
        brand: {
          50: "#eef0fb",
          100: "#e0e3f7",
          200: "#c4caf0",
          300: "#9fa8e6",
          400: "#7681d6",
          500: "#5560c4",
          600: "#4149a8",
          700: "#373d8a",
          800: "#2f3470",
          900: "#2a2e5c",
          950: "#1a1c38",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Hiragino Kaku Gothic ProN'",
          "'Noto Sans JP'",
          "Meiryo",
          "sans-serif",
        ],
        // 明朝系のエディトリアル・セリフ（見出し/数字に上質感）
        serif: [
          "'Hiragino Mincho ProN'",
          "'Yu Mincho'",
          "YuMincho",
          "'Noto Serif JP'",
          "Georgia",
          "'Times New Roman'",
          "serif",
        ],
        mono: [
          "ui-monospace",
          "'SF Mono'",
          "'Cascadia Code'",
          "Consolas",
          "monospace",
        ],
      },
      letterSpacing: {
        luxe: "0.06em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(14,13,11,0.04), 0 4px 14px -6px rgba(14,13,11,0.10)",
        card: "0 1px 3px rgba(14,13,11,0.05), 0 10px 30px -12px rgba(14,13,11,0.14)",
        ink: "0 8px 24px -8px rgba(14,13,11,0.30)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.85)" },
          "55%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        "tab-pop": {
          "0%": { transform: "translateY(2px) scale(0.9)" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.22s ease-out",
        "pop-in": "pop-in 0.18s ease-out",
        "slide-up": "slide-up 0.32s cubic-bezier(0.16,1,0.3,1)",
        pop: "pop 0.3s cubic-bezier(0.16,1,0.3,1)",
        shake: "shake 0.4s ease-in-out",
        "tab-pop": "tab-pop 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
