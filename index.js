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

inquirer.prompt(QUESTIONS).then(answers => {
  console.log(answers);
});

//const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS).then(answers => {
  // const projectChoice = answers["project-choice"];
  const projectName = answers["project-name"];
  const gitRemote = answers["gitHub-remote"];
  // const templatePath = `${__dirname}/templates/${projectChoice}`;

  //fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  generator(/*templatePath,*/ projectName, gitRemote, callBack);
});

function generator(/*path,*/ name = "new_project", gitRemote, cb) {
  makeDir(name, createProjectFolder);
  child_process.exec("git init", { cwd: `./${name}` }, err => {
    if (err) console.log(err);
    else {
      console.log("git init complete");
    }
  });
  child_process.exec("npm init -y", { cwd: `./${name}` }, err => {
    if (err) console.log(err);
    else {
      console.log("npm init complete");
    }
  });
  child_process.exec("npm i chai mocha -D", { cwd: `./${name}` }, err => {
    if (err) console.log(err);
    else {
      console.log("npm installed");
    }
  });
  if (gitRemote) {
    child_process.exec(
      `git remote add origin ${gitRemote}`,
      { cwd: `./${name}` },
      err => {
        if (err) console.log(err);
        else {
          console.log(`git remote added: ${gitRemote}`);
        }
      }
    );
    child_process.exec(`git add .`, { cwd: `./${name}` }, err => {
      if (err) console.log(err);
      else {
        console.log(`git add complete for all files`);
      }
    });
    child_process.exec(
      `git commit -m 'initial project setup'`,
      { cwd: `./${name}` },
      err => {
        if (err) console.log(err);
        else {
          console.log(`git commit - initial project set up`);
        }
      }
    );
    child_process.exec(`git push origin master`, { cwd: `./${name}` }, err => {
      if (err) console.log(err);
      else {
        console.log(`complete git push`);
      }
    });
  }
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

function gitInit() {}

function npmInstall() {}

function callBack(err, data) {
  if (err) console.log("error: " + err);
  console.log(`created : ${data}`);
}

//generate("new_project", callBack);

module.exports = { makeDir, createProjectFolder };
