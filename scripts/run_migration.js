const fs = require("fs");
const exec = require("child_process").exec;
const async = require("async");
const path = require("path");

const migrationFilesPath = path.resolve(__dirname, "../migrations");
const files = fs.readdirSync(migrationFilesPath);

files.map(function(file) {
  console.log(`${path.join(migrationFilesPath, file)}`);
  return exec(`node ${path.join(migrationFilesPath, file)}`);
});
