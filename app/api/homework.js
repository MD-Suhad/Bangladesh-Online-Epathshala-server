module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  // app.get("/api/routine", (req, res) => {
  //   con.query(
  //     "SELECT id, routine_default_name FROM routine",
  //     function (err, result, fields) {
  //       if (err) throw err;
  //       res.send(result);
  //     }
  //   );
  // });
  app.get("/api/homework/all", authenticateToken, (req, res) => {
    var sql = `select home_work.id, class.class_name, subject.subject_name, teacher.first_name, topic, details, issue_date, due_date, session.session_year
    from home_work
    join class on home_work.class_id=class.id 
    join section on home_work.section_id=section.id
    join subject on home_work.subject_id=subject.id
    join teacher on home_work.teacher_id=teacher.id
    join session on home_work.session_id=session.id
    order by home_work.id;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/homework/all/date", authenticateToken, (req, res) => {
    var sql = `select home_work.id, class.class_name, subject.subject_name, home_work.teacher_id, teacher.first_name, teacher.initial, topic, details, issue_date, due_date, session.session_year
    from home_work
    join class on home_work.class_id=class.id 
    join section on home_work.section_id=section.id
    join subject on home_work.subject_id=subject.id
    join teacher on home_work.teacher_id=teacher.id
    join session on home_work.session_id=session.id
    where home_work.school_info_id="${req.query.school_info_id}" and home_work.issue_date="${req.query.date}"
    order by home_work.id;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/homework/all/filter", authenticateToken, (req, res) => {
    var sql = `select home_work.id, class.class_name, subject.subject_name, home_work.teacher_id, teacher.first_name, teacher.initial, topic, details, issue_date, due_date, session.session_year
    from home_work
    join class on home_work.class_id=class.id 
    join section on home_work.section_id=section.id
    join subject on home_work.subject_id=subject.id
    join teacher on home_work.teacher_id=teacher.id
    join session on home_work.session_id=session.id
    where home_work.school_info_id="${req.query.school_info_id}" and home_work.class_id="${req.query.class_id}" and home_work.section_id="${req.query.section_id}" and home_work.subject_id="${req.query.subject_id}" and home_work.issue_date="${req.query.date}"
    order by home_work.id;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/homework/teacher/individual", authenticateToken, (req, res) => {
    var sql = `select home_work.id, class.class_name, subject.subject_name, teacher.first_name, topic, details, issue_date, due_date, session.session_year
    from home_work
    join class on home_work.class_id=class.id 
    join section on home_work.section_id=section.id
    join subject on home_work.subject_id=subject.id
    join teacher on home_work.teacher_id=teacher.id
    join session on home_work.session_id=session.id
    where home_work.teacher_id="${req.query.teacher_id}"
    order by home_work.id;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.post("/api/homework/teacher", authenticateToken, (req, res) => {
    var school_info_id = req.body.school_info_id;
    var class_id = req.body.class_id;
    var section_id = req.body.section_id;
    var teacher_id = req.body.teacher_id;
    var subject_id = req.body.subject_id;
    var session_id = req.body.session_id;
    var topic = req.body.topic;
    var details = req.body.details;
    var issue_date = req.body.issue_date;
    var due_date = req.body.due_date;

    var sql = `INSERT INTO home_work (school_info_id, class_id, section_id, teacher_id, subject_id, session_id , topic, details, issue_date, due_date) VALUES ("${school_info_id}", "${class_id}", "${section_id}", "${teacher_id}", "${subject_id}", "${session_id}", "${topic}", "${details}", "${issue_date}", "${due_date}" )`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.json({ status: "success" });
    });
  });

  //Home Mark Submission
  app.post("/api/homework/submit", authenticateToken, (req, res) => {
    var student_id = req.body.student_id;
    var homework_id = req.body.homework_id;
    var submission_time = req.body.submission_time;
    var attachment_link = req.body.attachment_link;

    var sql = `INSERT INTO home_work_submission (student_present_status_id, home_work_id, submission_time, attachment_link) VALUES ("${student_id}", "${homework_id}", "${submission_time}", "${attachment_link}" )`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.json({ status: "success" });
    });
  });

  app.get("/api/homework/student/", authenticateToken, (req, res) => {
    var sql = `select home_work.id, class.class_name, subject.subject_name, CONCAT( teacher.first_name, ' ',  teacher.middle_name, ' ',  teacher.last_name ) AS teacher_name, topic, details, issue_date, due_date, session.session_year
    from home_work
    join class on home_work.class_id=class.id 
    join section on home_work.section_id=section.id
    join subject on home_work.subject_id=subject.id
    join teacher on home_work.teacher_id=teacher.id
    join session on home_work.session_id=session.id
    where home_work.section_id="${req.query.section_id}"
    order by home_work.due_date;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/homework/student/id", authenticateToken, (req, res) => {
    var sql = `select home_work.id, class.class_name, subject.subject_name, CONCAT( teacher.first_name, ' ',  teacher.middle_name, ' ',  teacher.last_name ) AS teacher_name, topic, details, issue_date, due_date, session.session_year
    from home_work
    join class on home_work.class_id=class.id 
    join section on home_work.section_id=section.id
    join subject on home_work.subject_id=subject.id
    join teacher on home_work.teacher_id=teacher.id
    join session on home_work.session_id=session.id
    where home_work.id="${req.query.homework_id}";`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        res.send(result[0]);
      }
    });
  });

  app.get("/api/homework/student/submit/all", authenticateToken, (req, res) => {
    var sql = `select * from home_work_submission;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/homework/teacher/submitlist", authenticateToken, (req, res) => {
    var sql = `select student.student_code, CONCAT( student.first_name, ' ', student.middle_name, ' ', student.last_name ) AS full_name, home_work_submission.submission_time, home_work_submission.attachment_link 
    from home_work_submission 
    join student_present_status on home_work_submission.student_present_status_id=student_present_status.id
    join student on student_present_status.student_id=student.id
    where home_work_id="${req.query.home_work_id}";`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
};
