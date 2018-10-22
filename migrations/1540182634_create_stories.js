// CREATE Stories table for story model.

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../db/database.db");

const db = new sqlite3.Database(dbPath);

// TODO maybe need a DSL
db.serialize(function() {
  db.run(
    "CREATE TABLE stories(\
      id integer PRIMARY KEY,\
      content text NOT NULL,\
      title text NOT NULL,\
      author text NOT NULL,\
      email text NOT NULL,\
      state text NOT NULL,\
      createdAt date NOT NULL\
    );"
  );
});
