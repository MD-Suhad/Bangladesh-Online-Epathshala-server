
module.exports = (app) => {
    const con = require("../models/db");
    const authenticateToken = require("../middleware/middleware");
    app.get('/api/student_mark', authenticateToken, (req, res) => {

        var sql = `SELECT student.student_code,section.section_default_name,concat(student.first_name," " ,student.middle_name) as name, session.session_year,student_present_status.student_id,student_present_status.class_id,student_present_status.session_id,class.class_name,student_present_status.shift_id,student_present_status.class_roll_no,student_present_status.school_info_id
         from student 
         JOIN student_present_status ON student.id = student_present_status.student_id
         JOIN school_info ON school_info.id = student_present_status.school_info_id INNER JOIN session ON session.id = student_present_status.session_id 
         JOIN class ON class.id = student_present_status.class_id 
         JOIN section ON section.id = student_present_status.section_id 
        WHERE section_id = "${req.query.section_id}"  and session_id = "${req.query.session_id}" and class.id = "${req.query.class_id}" `
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });

    })
    app.get('/api/student_mark', authenticateToken, (req, res) => {

        var sql = `SELECT student.student_code,section.section_default_name,concat(student.first_name," " ,student.middle_name) as name, session.session_year,student_present_status.student_id,student_present_status.class_id,student_present_status.session_id,class.class_name,student_present_status.shift_id,student_present_status.class_roll_no,student_present_status.school_info_id
         from student 
         JOIN student_present_status ON student.id = student_present_status.student_id
         JOIN school_info ON school_info.id = student_present_status.school_info_id INNER JOIN session ON session.id = student_present_status.session_id 
         JOIN class ON class.id = student_present_status.class_id 
         JOIN section ON section.id = student_present_status.section_id 
        WHERE section_id = "${req.query.section_id}"  and session_id = "${req.query.session_id}" and class.id = "${req.query.class_id}" and student_present_status.school_info_id="${req.query.school_info_id}" `
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


    app.get('/api/exam_mark', authenticateToken, (req, res) => {

        var sql = `select exam_marks.id,marks_obtained,student.student_code,section.section_default_name,session.session_year,CONCAT(student.first_name,' ' ,student.middle_name) as name,class.class_name,exam_name.exam_name,school_info.school_name,school_info.address_district,subject.subject_name
        from exam_marks
        INNER join exam_name on exam_name.id=exam_marks.exam_info_id
          INNER join student_present_status on student_present_status.id=exam_marks.student_id
          LEFT join student on student.id=student_present_status.student_id
          LEFT join class on class.id=student_present_status.class_id
          LEFT join section on section.id=student_present_status.section_id
          LEFT join session on session.id=student_present_status.session_id
          LEFT join school_info on school_info.id=student_present_status.school_info_id
          inner join subject on subject.id=exam_marks.subject_id

          Where session_id="${req.query.session_id}" and exam_info_id="${req.query.exam_info_id}" and student_code="${req.query.student_code}"
        
        `
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });

    })
    app.get('/api/exam_mark/search', authenticateToken, (req, res) => {

        var sql = `select exam_marks.id,marks_obtained,student_present_status.id,student.student_code,session.session_year,CONCAT(student.first_name,' ' ,student.middle_name) as name,class.class_name,exam_name.exam_name,school_info.school_name,school_info.address_district,subject.subject_name
        from student_present_status
        INNER join exam_name on exam_name.id=exam_marks.exam_info_id
          INNER join student_present_status on student_present_status.id=exam_marks.student_id
          LEFT join student on student.id=student_present_status.student_id
          LEFT join class on class.id=student_present_status.class_id
          LEFT join section on section.id=student_present_status.section_id
          LEFT join session on session.id=student_present_status.session_id
          LEFT join school_info on school_info.id=student_present_status.school_info_id
          inner join subject on subject.id=exam_marks.subject_id

          Where session_id="${req.query.session_id}" and exam_info_id="${req.query.exam_info_id}" and class.id="${req.query.class_id}" and section.id="${req.query.section_id}" and subject.id="${req.query.subject_id}" and school_info.id="${req.query.school_info_id}"
        
        `
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });

    })
    app.get("/api/school_info", authenticateToken, (req, res) => {
        var sql = 'select school_code,school_name from school_info';
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        })
    })


}