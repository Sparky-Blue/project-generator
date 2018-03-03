const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const CURR_DIR = process.cwd();
const child_process = require("child_process");

function createDirectories(name, directoryList = [""]) {
  const directoryCreate = directoryList.map(directory => {
    return fs.mkdirAsync(`${name}/${directory}`);
  });
  return Promise.all(directoryCreate);
}

function createFiles(name, fileList) {
  const fileCreate = fileList.map(file => {
    return fs.writeFileAsync(`${CURR_DIR}/${name}${file.path}`, file.data);
  });
  return Promise.all(fileCreate);
}

function inits(name, command) {
  child_process.exec(command, {
    cwd: `./${name}`
  });
}

function gitRemoteSetup(name, gitRemote) {
  child_process.exec(
    `git init && git remote add origin ${gitRemote} && git add . && git commit -m 'initial project setup' && git push origin master`,
    { cwd: `./${name}` }
  );
}

module.exports = { createDirectories, createFiles, inits, gitRemoteSetup };
