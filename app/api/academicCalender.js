module.exports = (app) => {

    const con = require("../models/db");
    const authenticateToken = require("../middleware/middleware");
    app.get("/api/calender", authenticateToken, (req, res) => {
        con.query(
            "SELECT id,school_info_id,date,topics FROM academic_calendar",
            function (err, result, fields) {
                if (err) throw err;
                res.send(result);
            }
        );
    });

    app.get("/api/calender/student", (req, res) => {
        con.query(
            `SELECT id,date,topics FROM academic_calendar where school_info_id="${req.query.school_info_id}"`,
            function (err, result, fields) {
                if (err) throw err;
                res.send(result);
            }
        );
    });
    app.get("/api/calender/teacher", authenticateToken, (req, res) => {
        con.query(
            `SELECT id,date,topics FROM academic_calendar where school_info_id="${req.query.school_info_id}"`,
            function (err, result, fields) {
                if (err) throw err;
                res.send(result);
            }
        );
    });

    app.post("/api/calender", authenticateToken, (req, res) => {
        var date = req.body.date;
        var topics = req.body.topics;
        var school_info_id = req.body.school_info_id;
        var sql = `INSERT INTO academic_calendar (school_info_id,date,topics) VALUES ("${school_info_id}", "${date}", "${topics}")`;
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });

}