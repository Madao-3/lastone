var controllers = require("../app/controllers");

module.exports = function(app) {
  app.get("/", controllers.home);
  app.get("/stories", controllers.stories.list);
  app.post("/stories", controllers.stories.create);
};
