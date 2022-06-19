module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  app.get("/api/period", authenticateToken, (req, res) => {
    con.query(
      "SELECT id, period_code FROM period",
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/period/school", authenticateToken, (req, res) => {
    con.query(
      `SELECT id, period_code FROM period where school_info_id="${req.query.school_info_id}"`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/period/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM period", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
};
