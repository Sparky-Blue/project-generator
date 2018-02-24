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
}
`;

const jsonData = `{
  "name": "core-ft-async-awareness",
  "version": "1.0.0",
  "description":
    "Async callbacks is the very basics of understanding how to use asyncronous code in JavaScript",
  "main": "main.js",
  "scripts": {
    "test-utils": "mocha ./spec/utils.spec.js",
    "test-dev": "mocha ./spec/main.spec.js",
    "test-generator": "mocha ./generator/spec/index.spec.js",
    "test": "mocha ./generator/spec/*.spec.js --bail",
    "lint": "eslint ./",
    "posttest": "npm run lint"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/northcoders/CORE-FT-async-awareness.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/northcoders/CORE-FT-async-awareness/issues"
  },
  "homepage": "https://github.com/northcoders/CORE-FT-async-awareness#readme",
  "devDependencies": {
    "chai": "^3.5.0",
    "eslint": "^3.15.0",
    "mocha": "^5.0.1",
    "sinon": "^3.2.1"
  },
  "dependencies": {
    "async": "^2.6.0",
    "fs": "0.0.1-security"
  }
}
`;

const gitIgnoreData = "node_modules";

module.exports = { eslintData, jsonData, gitIgnoreData };
