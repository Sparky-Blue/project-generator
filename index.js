#!/usr/bin/env node

const fs = require("fs");
const { eslintData, jsonData, gitIgnoreData } = require("./data");
const inquirer = require("inquirer");
const child_process = require("child_process");

// const CHOICES = fs.readdir(
//   `generator/templates`,
//   "utf8",
//   callBack(null, `generator/templates`)
// );

const QUESTIONS = [
  // {
  //   name: "project-choice",
  //   type: "list",
  //   message: "What project template would you like to generate?",
  //   choices: CHOICES
  // },
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
  // const projectChoice = answers["project-choice"];
  const projectName = answers["project-name"];
  const gitRemote = answers["gitHub-remote"];
  // const templatePath = `${__dirname}/templates/${projectChoice}`;

  //fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  generator(/*templatePath,*/ projectName, gitRemote);
});

function generator(/*path,*/ name = "new_project", gitRemote) {
  makeDir(name, gitRemote, createProjectFolder);
  // inits(name, initComplete);
  // gitRemoteSetup(name, gitRemote);
}

function makeDir(path, gitRemote, cb) {
  fs.mkdir(path, err => {
    if (err) console.log("makeDir error" + err + path);
    cb(null, path, gitRemote);
  });
}

function createProjectFolder(err, data, gitRemote) {
  if (err) console.log("Create ProjectFolder error: " + err);
  else {
    // const callGit = gitRemoteSetup(data, gitRemote, callBack);
    const callInit = inits(null, data, gitRemote, gitRemoteSetup);

    const lint = makeFile(`./${data}/.eslintrc`, eslintData, callInit);
    const gitIgnore = makeFile(`./${data}/.gitignore`, gitIgnoreData, lint);
    const pJSON = makeFile(`./${data}/package.json`, jsonData, gitIgnore);
    const ReadMe = makeFile(`./${data}/README.md`, "Read me...", pJSON);
    const indexFile = makeFile(
      `./${data}/index.js`,
      "module.exports = {};",
      ReadMe
    );

    makeDir(`${data}/spec`, gitRemote, (err, data) => {
      if (err) console.log(err);
      else {
        makeFile(
          `./${data}/index.spec.js`,
          "const {expect} = require('chai');",
          indexFile
        );
      }
    });
  }
}

function makeFile(name, data) {
  fs.writeFile(name, data, "utf8", err => {
    if (err) console.log("writeFile error" + err);
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

//generate("new_project", callBack);

module.exports = { makeDir, createProjectFolder };
