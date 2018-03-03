const { eslintData, gitIgnoreData } = require("./fileData");

const NPMDirs = ["spec"];
const filesNPM = [
  { name: "lint", path: `/.eslintrc`, data: eslintData },
  { name: "gitIgnore", path: `/.gitignore`, data: gitIgnoreData },
  { name: "ReadMe", path: `/README.md`, data: "Read me..." },
  {
    name: "indexFile",
    path: `/index.js`,
    data: "module.exports = {};"
  }
];

const commandsNPM = "npm init -y && npm i chai mocha -D";

module.exports = { NPMDirs, filesNPM, commandsNPM };
