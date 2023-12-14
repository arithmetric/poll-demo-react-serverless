module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@stylistic",
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@stylistic/indent": ["error", 2],
    "@stylistic/linebreak-style": ["error", "unix"],
    "@stylistic/semi": ["error", "always"],
  }
};
