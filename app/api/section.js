module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  app.get("/api/section", authenticateToken, (req, res) => {
    con.query(
      `SELECT id, section_default_name FROM section where class.id="${req.query.class_id}"`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/section/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM section", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
};
