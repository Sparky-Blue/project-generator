#!/usr/bin/env node

const fs = require("fs");
const {
  eslintData,
  jsonData,
  gitIgnoreData,
  cssNormalizeData
} = require("./data");
const inquirer = require("inquirer");
const child_process = require("child_process");

const projectTypes = ["NPM_Project", "HTML_Project"];

const QUESTIONS = [
  {
    name: "project-choice",
    type: "list",
    message: "What project template would you like to generate?",
    choices: projectTypes
  },
  {
    name: "project-name",
    type: "input",
    message: "Project name:",
    validate: function(input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else
        return "Project name may only include letters, numbers, underscores and hashes.";
    }
  },
  {
    name: "gitHub-remote-query",
    type: "confirm",
    message: "Do you want to add a git remote?"
  },
  {
    name: "gitHub-remote",
    type: "input",
    message: "Please enter the gitHub remote address",
    when: function(answers) {
      return answers["gitHub-remote-query"] ? true : false;
    }
  }
];

//const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS).then(answers => {
  const projectChoice = answers["project-choice"];
  const projectName = answers["project-name"];
  const gitRemote = answers["gitHub-remote"];
  // const templatePath = `${__dirname}/templates/${projectChoice}`;

  //fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  generator(projectChoice, projectName, gitRemote);
});

function generator(projectChoice, name = "new_project", gitRemote) {
  let arrayOfFiles = [];
  if (projectChoice === "NPM_Project")
    arrayOfFiles = [
      { name: "lint", path: `./${name}/.eslintrc`, data: eslintData },
      { name: "gitIgnore", path: `./${name}/.gitignore`, data: gitIgnoreData },
      { name: "pJSON", path: `./${name}/package.json`, data: jsonData },
      { name: "ReadMe", path: `./${name}/README.md`, data: "Read me..." },
      {
        name: "indexFile",
        path: `./${name}/index.js`,
        data: "module.exports = {};"
      }
    ];
  else if (projectChoice === "HTML_Project")
    arrayOfFiles = [
      { name: "lint", path: `./${name}/.eslintrc`, data: eslintData },
      { name: "gitIgnore", path: `./${name}/.gitignore`, data: gitIgnoreData },
      { name: "ReadMe", path: `./${name}/README.md`, data: "Read me..." },
      {
        name: "index.html",
        path: `./${name}/index.html`,
        data: " "
      },
      { name: "css", path: `./${name}/css/main.css`, data: " " },
      {
        name: "normCSS",
        path: `./${name}/css/normalize.css`,
        data: cssNormalizeData
      },
      { name: "index.js", path: `./${name}/js/index.js`, data: " " }
    ];
  makeDir(name, gitRemote, arrayOfFiles, projectChoice, createProjectFolder);
}

function makeDir(path, gitRemote, array, projectChoice, cb) {
  fs.mkdir(path, err => {
    if (err) console.log("makeDir error" + err + path);
    cb(null, path, gitRemote, array, projectChoice);
  });
}

function createProjectFolder(err, data, gitRemote, array, projectChoice) {
  let fileCount = 0;
  if (err) console.log("Create ProjectFolder error: " + err);
  else {
    if (projectChoice === "NPM_Project") {
      makeDir(`${data}/spec`, gitRemote, array, null, (err, data) => {
        if (err) console.log(err);
        else {
          makeFile(
            `./${data}/index.spec.js`,
            "const {expect} = require('chai');",
            callBack
          );
        }
      });
    } else if (projectChoice === "HTML_Project") {
      makeDir(`${data}/css`, gitRemote, array, null, (err, data) => {
        if (err) console.log(err);
        else {
          console.log("complete css/");
        }
      });
      makeDir(`${data}/images`, gitRemote, array, null, (err, data) => {
        if (err) console.log(err);
        else {
          console.log("complete images/");
        }
      });
      makeDir(`${data}/js`, gitRemote, array, null, (err, data) => {
        if (err) console.log(err);
        else {
          console.log("complete js/");
        }
      });
    }
    array.forEach(file => {
      makeFile(file.path, file.data, callBack);
      fileCount++;
      if (fileCount === array.length) {
        if (projectChoice === "NPM_Project") {
          inits(null, data, gitRemote, gitRemoteSetup);
        }
      }
    });
  }
}

function makeFile(name, data, cb) {
  fs.writeFile(name, data, "utf8", err => {
    if (err) console.log("writeFile error" + err);
    else cb(null, name);
  });
}

function inits(err, name, gitRemote, cb) {
  if (err) console.log(err);
  else {
    child_process.exec(
      "npm init -y && npm i chai mocha -D",
      { cwd: `./${name}` },
      err => {
        if (err) console.log(err);
        else {
          console.log("npm init complete");
        }
      }
    );
    if (gitRemote) cb(name, gitRemote);
  }
}

function gitRemoteSetup(name, gitRemote) {
  child_process.exec(
    `git init && git remote add origin ${gitRemote} && git add . && git commit -m 'initial project setup' && git push origin master`,
    { cwd: `./${name}` },
    err => {
      if (err) console.log(err);
      else {
        console.log(
          `git remote added: ${gitRemote} and setup pushed to origin master`
        );
      }
    }
  );
}

function callBack(err, data) {
  if (err) console.log("error: " + err);
  console.log(`created : ${data}`);
}

module.exports = { makeDir, createProjectFolder };
