const fs = require("fs");
const { eslintData, jsonData, gitIgnoreData } = require("./data");
function generate(name = "new_project", cb) {
  if (process.argv[2]) name = process.argv[2];
  makeDir(name, createProjectFolder);
  cb(null, name);
}

function createProjectFolder(err, data) {
  if (err) console.log("Create ProjectFolder error: " + err);
  else {
    makeDir(`${data}/spec`, callBack);
    makeFile(`./${data}/index.js`, "module.exports = {};", callBack);
    makeFile(
      `./${data}/spec/index.spec.js`,
      "const {expect} = require('chai');",
      callBack
    );
    makeFile(`./${data}/README.md`, "Read me...", callBack);
    makeFile(`./${data}/package.json`, jsonData, callBack);
    makeFile(`./${data}/.gitignore`, gitIgnoreData, callBack);
    makeFile(`./${data}/.eslintrc`, eslintData, callBack);
  }
}

function makeDir(path, cb) {
  fs.mkdir(path, err => {
    if (err) console.log("makeDir error" + err + path);
    cb(null, path);
  });
}

function makeFile(name, data, cb) {
  fs.writeFile(name, data, "utf8", err => {
    if (err) console.log("writeFile error" + err);
    cb(null, name);
  });
}

function callBack(err, data) {
  if (err) console.log("error: " + err);
  console.log(`created : ${data}`);
}

generate("new_project", callBack);

module.exports = { makeDir, createProjectFolder };
