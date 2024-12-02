import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      react,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,

      "no-console": "off", // Warn about console statements
      "react/react-in-jsx-scope": "off",
      quotes: [
        "error",
        "double",
        { allowTemplateLiterals: true, avoidEscape: true },
      ], // Default to double quotes but allow exceptions
      semi: ["error", "always"], // Enforce semicolons
    },
  },
  {
    files: ["coverage/**/*"],
    rules: {
      quotes: "off",
    },
  },
];
