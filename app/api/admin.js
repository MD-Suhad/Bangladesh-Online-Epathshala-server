module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  app.get("/api/administrator", authenticateToken, (req, res) => {
    con.query(
      "SELECT id, CONCAT( first_name, ' ', middle_name, ' ', last_name ) AS full_name, initial FROM administrator",
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/administrator/profile", authenticateToken, (req, res) => {
    con.query(
      `SELECT id, CONCAT( first_name, ' ', middle_name, ' ', last_name ) AS full_name, initial, admin_code, mobile, email, school_info_id FROM administrator where id="${req.query.administrator_id}"`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/administrator/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM administrator", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/super_admin", authenticateToken, (req, res) => {
    con.query("SELECT * FROM super_admin", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.get("/api/schooladmin", (req, res) => {
    con.query(`select id from school_admin where admin_code="${req.query.admin_code}"`, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
};
