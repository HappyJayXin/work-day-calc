import nextPlugin from "eslint-config-next";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  ...nextPlugin,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      quotes: ["error", "double"],
      "prettier/prettier": "error",
    },
  },
];
