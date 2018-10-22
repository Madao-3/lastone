var orm = require("orm");
const path = require("path");

const dbPath = path.resolve(__dirname, "../../db/database.db");
var connection = null;

function setup(db, cb) {
  require("./story")(orm, db);
  console.log("setup!");
  return cb(null, db);
}

module.exports = function(cb) {
  if (connection) return cb(null, connection);
  orm.connect(
    `sqlite://${dbPath}`,
    function(err, db) {
      console.log(err, db);
      if (err) return cb(err);

      connection = db;
      db.settings.set("instance.returnAllErrors", true);
      setup(db, cb);
    }
  );
};
