module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  app.get("/api/shift", authenticateToken, (req, res) => {
    con.query(
      "SELECT id, shift_name FROM shift",
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/shift/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM shift", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
};
