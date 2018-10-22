var path = require("path");

var settings = {
  path: path.normalize(path.join(__dirname, "..")),
  port: process.env.NODE_PORT || 3000,
  database: {
    protocol: "sqlite", // or "mysql"
    query: { pool: true }
  }
};

module.exports = settings;
