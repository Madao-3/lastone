app.get("/", function(req, res) {
  res.send("Hello World!");
});
app.post("/", function(req, res) {
  res.send("Got a POST request");
});
