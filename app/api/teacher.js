module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  app.get("/api/teacher", authenticateToken, (req, res) => {
    con.query(
      "SELECT id, CONCAT( first_name, ' ', middle_name, ' ', last_name ) AS full_name, initial FROM teacher",
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/teacher/profile", (req, res) => {
    con.query(
      `SELECT id, CONCAT( first_name, ' ', middle_name, ' ', last_name ) AS full_name, initial, teacher_code, mobile, email, school_info_id FROM teacher where id="${req.query.teacher_id}"`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result[0]);
      }
    );
  });
  app.get("/api/teacher/filter", (req, res) => {
    con.query(
      `SELECT id, CONCAT( first_name, ' ', middle_name, ' ', last_name ) AS full_name, initial, teacher_code, mobile,designation, email, school_info_id FROM teacher where school_info_id="${req.query.school_info_id}"`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/teacher/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM teacher", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

};
