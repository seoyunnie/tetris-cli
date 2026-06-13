import { baseConfig } from "@seoyunnie/oxc-config/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  options: { reportUnusedDisableDirectives: "warn", typeAware: true, typeCheck: true },

  env: { builtin: true, node: true, es2024: true },

  extends: [baseConfig],

  overrides: [
    {
      files: ["src/core/tetrominoes.ts"],

      rules: {
        /* Style */
        "eslint/no-magic-numbers": "off",
      },
    },
  ],
});
