module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  app.get("/api/day", authenticateToken, (req, res) => {
    con.query("SELECT id, day FROM day", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/day/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM day", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
};
