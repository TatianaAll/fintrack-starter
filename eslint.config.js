import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import sonarjs from "eslint-plugin-sonarjs";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.test.js"],
    languageOptions: { globals: { ...globals.browser, ...globals.jest } },
  },
  {
    files: ["**/*.{config.js,config.mjs,config.cjs}"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.js"],
    plugins: {
      sonarjs,
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
      "sonarjs/cognitive-complexity": ["warn", 15],
    },
  },
  pluginReact.configs.flat.recommended,
]);
