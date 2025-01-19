import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable specific rules
      "@typescript-eslint/no-explicit-any": "off",  // Disable 'any' type usage warning
      "@typescript-eslint/no-unused-vars": "off",  // Disable unused variables warning
      "no-var": "off",  // Disable 'no-var' rule to allow 'var' usage
      'react/no-unescaped-entities': 'off',
    },
  },
];

export default eslintConfig;
