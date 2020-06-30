module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
      ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect"
    }
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "react/prop-types": 0,
    "react/display-name": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
  },
};