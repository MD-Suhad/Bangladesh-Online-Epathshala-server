
module.exports = (app) => {
    const con = require("../models/db");
    const authenticateToken = require("../middleware/middleware");
    app.get('/api/status', (req, res) => {

        var sql = `SELECT student.student_code,section.section_default_name,concat(student.first_name," " ,student.middle_name) as name, session.session_year,student_present_status.student_id,student_present_status.class_id,student_present_status.session_id,class.class_name,student_present_status.shift_id,student_present_status.class_roll_no,student_present_status.school_info_id from student 
         JOIN student_present_status ON student.id = student_present_status.student_id
         JOIN school_info ON school_info.id = student_present_status.school_info_id INNER JOIN session ON session.id = student_present_status.session_id 
         JOIN class ON class.id = student_present_status.class_id 
         JOIN section ON section.id = student_present_status.section_id 
        WHERE section_id = "${req.query.section_id}" and school_code = "${req.query.school_code}" and session_id = "${req.query.session_id}" and class.id = "${req.query.class_id}" `
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });

    })

    app.post("/api/exam_mark", authenticateToken, (req, res) => {
        var exam_info_id = req.body.exam_info_id;
        var subject_id = req.body.subject_id;
        var mark_update = req.body.mark_update;

        var sql = `INSERT INTO exam_marks (exam_info_id,subject_id,student_id,marks_obtained) VALUES `
        mark_update.map((sts) => {
            sql += ` ('${exam_info_id}','${subject_id}','${sts.student_id}','${sts.mark_obtained}'),`
        });
        sql = sql.slice(0, -1);
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });

    app.get("/api/school_info", authenticateToken, (req, res) => {
        var sql = 'select school_code,school_name from school_info';
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        })
    })
    app.post("/api/status", authenticateToken, (req, res) => {

        var school_info_id = req.body.school_info_id;
        var shift_id = req.body.shift_id;
        var section_id = req.body.section_id;
        var students_update = req.body.students_update;

        var sql = `INSERT INTO student_present_status (school_info_id,session_id,shift_id,student_id,class_id,section_id,class_roll_no) VALUES `
        students_update.map((sts) => {
            sql += ` ('${school_info_id}','${sts.session_id}','${shift_id}','${sts.student_id}','${sts.class_id}','${section_id}','${sts.class_roll_no}'), `
        });
        sql = sql.slice(0, -2);
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });
    app.get("/api/student-check", (req, res) => {
        var sql = `select student_present_status.id ,class.id as class,school_info.school_name, student.school_info_id as school_id from student_present_status 
        inner join student on student_present_status.student_id=student.id
        join class on student_present_status.class_id=class.id
       inner join school_info on student_present_status.school_info_id=school_info.id
         where student.student_code = "${req.query.student_code}"`;;
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(result[0])
        })
    })
}