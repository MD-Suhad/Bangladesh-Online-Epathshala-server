module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  app.get("/api/session", authenticateToken, (req, res) => {
    con.query(
      "SELECT id, session_year FROM session",
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/session/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM session", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
};
