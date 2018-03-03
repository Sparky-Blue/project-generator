const eslintData = `{
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "node": true,
    "mocha": true,
    "browser": true,
    "es6": true
  },
  "extends": ["eslint:recommended"],
  "plugins": [
  ],
  "rules": {
    "no-console": 0,
    "space-before-blocks": 1,
    "arrow-spacing": 1,
    "keyword-spacing": 1,
    "space-infix-ops": 1,
    "space-in-parens": 1,
    "spaced-comment": 1,
    "semi": 1,
    "no-multiple-empty-lines": 1
  }
}`;

const gitIgnoreData = "node_modules";

module.exports = { eslintData, gitIgnoreData };
