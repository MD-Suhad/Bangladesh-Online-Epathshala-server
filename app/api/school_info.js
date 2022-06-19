module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  app.get("/api/school_info", (req, res) => {
    con.query(
      `SELECT id, school_name, type_id FROM school_info where administrator_id="${req.query.admin_id}"`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );

  });
  app.get("/api/school_name", (req, res) => {
    con.query(
      `SELECT id, school_name FROM school_info
      
      where student_id="${req.query.student_id}"`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );

  });

  app.get("/api/school_info/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM school_info", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/school_type/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM school_type", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
};
