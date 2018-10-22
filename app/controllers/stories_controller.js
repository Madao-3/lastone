var _ = require("lodash");
var helpers = require("./_helpers");
var orm = require("orm");

module.exports = {
  list: function(req, res, next) {
    console.log(req.models.story);
    req.models.stories
      .find()
      .limit(4)
      .order("-id")
      .all(function(err, stories) {
        if (err) return next(err);
        var items = stories.map(function(m) {
          return m.serialize();
        });
        res.send({ items: items });
      });
  },
  create: function(req, res, next) {
    var params = _.pick(req.body, "title", "body", "author", "email", "state");

    req.models.story.create(params, function(err, story) {
      if (err) {
        if (Array.isArray(err)) {
          return res.send(200, { errors: helpers.formatErrors(err) });
        } else {
          return next(err);
        }
      }

      return res.send(200, story.serialize());
    });
  },
  get: function(req, res, next) {}
};
