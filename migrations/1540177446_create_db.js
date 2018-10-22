const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../db/database.db");
console.log("test");
const db = new sqlite3.Database(dbPath);
