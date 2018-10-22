var path = require("path");
var express = require("express");
var settings = require("./config/settings");
var routes = require("./config/routes");
var models = require("./app/models/");

module.exports.start = function(done) {
  var app = express();

  app.use(function(req, res, next) {
    console.log("Time: %d", Date.now());
    models(function(err, db) {
      if (err) return next(err);
      req.models = db.models;
      req.db = db;
      return next();
    });
  });
  app.use(express.static(path.join(settings.path, "public")));

  routes(app);

  app
    .listen(settings.port, function() {
      console.log(("Listening on port " + settings.port).green);
      if (done) {
        return done(null, app, server);
      }
    })
    .on("error", function(e) {
      if (e.code == "EADDRINUSE") {
        console.log("Address in use. Is the server already running?".red);
      }
      if (done) {
        return done(e);
      }
    });
};

module.exports.start();
