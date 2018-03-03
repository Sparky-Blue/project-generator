#!/usr/bin/env node

const { filesHTML, HTMLdirs } = require("./data/HTML");
const { filesNPM, NPMDirs, commandsNPM } = require("./data/NPM");
const { serverDirs, filesServer, commandsServer } = require("./data/Server");
const {
  createDirectories,
  createFiles,
  inits,
  gitRemoteSetup
} = require("./utils/utils");
const inquirer = require("inquirer");

const projectTypes = ["NPM_Project", "HTML_Project", "Dev_Server_Project"];

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

inquirer.prompt(QUESTIONS).then(answers => {
  const projectChoice = answers["project-choice"];
  const projectName = answers["project-name"];
  const gitRemote = answers["gitHub-remote"];
  generator(projectChoice, projectName, gitRemote);
});

function generator(projectChoice, name = "new_project", gitRemote) {
  let filesList = [];
  let directoryList = [];
  let commands;
  if (projectChoice === "NPM_Project") {
    filesList = filesNPM;
    directoryList = NPMDirs;
    commands = commandsNPM;
  } else if (projectChoice === "HTML_Project") {
    filesList = filesHTML;
    directoryList = HTMLdirs;
  } else if (projectChoice === "Dev_Server_Project") {
    filesList = filesServer;
    directoryList = serverDirs;
    commands = commandsServer;
  }
  createDirectories(name)
    .then(() => {
      return createDirectories(name, directoryList);
    })
    .then(() => {
      return createFiles(name, filesList);
    })
    .then(() => {
      if (commands) return inits(name, commands);
    })
    .then(() => {
      if (gitRemote) return gitRemoteSetup(name, gitRemote);
    })
    .catch(err => console.log(err));
}
