module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  app.get("/api/subject", authenticateToken, (req, res) => {
    con.query(
      `SELECT id, subject_name FROM subject where class_id="${req.query.class_id}"and school_type_id="${req.query.school_type_id}"`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/subjects", authenticateToken, (req, res) => {
    con.query(
      `SELECT id, subject_name FROM subject where class_id="${req.query.class_id}"`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/subject/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM subject", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.get("/api/subject_type", authenticateToken, (req, res) => {
    con.query(
      `SELECT id, subject_name,subject_code FROM subject where subject.school_type_id="${req.query.school_type_id}"`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
};
