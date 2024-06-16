import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";
export default [
  { languageOptions: { globals: globals.browser } },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "public/",
      "src/assets/",
      "**/*.d.ts",
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
];
