import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url)); 

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: ["dist", "coverage"], 
  },
  {
    files: ["**/*.{ts,tsx}"], 
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.jest,
        global: true,
      },
      parser: tseslintParser,
      parserOptions: {
        project: "./tsconfig.app.json", 
        tsconfigRootDir: __dirname, 
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin, 
    },
    rules: {
      
      ...js.configs.recommended.rules,
      ...tseslintPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "prettier/prettier": "warn", 
    },
  },
];
