import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import tailwindcss from "eslint-plugin-tailwindcss";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        callees: ["cn", "cva"],
        config: "tailwind.config.ts",
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",

      /**
       * Tailwind + responsiveness linting
       */
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-contradicting-classname": "warn",

      /**
       * Heuristics for non‑responsive patterns that can break mobile layouts.
       * These are intentionally "warn" so they guide future code without blocking.
       */
      "no-restricted-syntax": [
        "warn",
        {
          selector: 'Literal[value=/w-\\[[0-9]+px\\]/]',
          message:
            "Avoid hard-coded fixed pixel widths in Tailwind classnames (e.g. w-[500px]); prefer responsive widths like w-full with breakpoint overrides.",
        },
        {
          selector: 'Literal[value=/h-\\[[0-9]+px\\]/]',
          message:
            "Avoid hard-coded fixed pixel heights in Tailwind classnames; use min-h, aspect-ratio, and responsive breakpoints instead.",
        },
        {
          selector: 'Literal[value=/overflow-x-(auto|scroll|visible)/]',
          message:
            "overflow-x combined with wide/fixed content often causes horizontal scrolling on mobile. Prefer overflow-hidden with responsive layouts unless horizontal scrolling is intentional.",
        },
        {
          selector: 'Literal[value=/\\bspace-x-\\d+\\b/]',
          message:
            "Prefer Tailwind gap-* utilities instead of space-* for layout spacing (gap-x-* / gap-y-*).",
        },
      ],
    },
  },
);
