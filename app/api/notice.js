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
  app.get("/api/notice/all", authenticateToken, (req, res) => {
    var sql = `select notice.id, notice.school_info_id, session.session_year, notice.section_id, class.class_name,  notice.notice_headline, notice.notice_description, notice.publishing_date,section.section_default_name
    from notice
    join class on notice.class_id=class.id 
    join section on notice.section_id=section.id
    join session on notice.session_id=session.id
    order by notice.id
    ;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/notice/school", authenticateToken, (req, res) => {
    var sql = `select notice.id, notice.school_info_id, session.session_year, notice.section_id, class.class_name,notice.student_id,  notice.notice_headline, notice.notice_description, notice.publishing_date,section.section_default_name
    from notice
    join class on notice.class_id=class.id 
    join section on notice.section_id=section.id
    join session on notice.session_id=session.id
    where notice.school_info_id="${req.query.school_info_id}"
    order by notice.id
    ;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/notice/creator", authenticateToken, (req, res) => {
    var sql = `select notice.id, notice.school_info_id, session.session_year, notice.section_id, class.class_name,  notice.notice_headline, notice.notice_description, notice.publishing_date
    from notice
    join class on notice.class_id=class.id 
    join section on notice.section_id=section.id
    join session on notice.session_id=session.id
    where notice.user_code="${req.query.uid}"
    order by notice.id
    ;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/notice/student", authenticateToken, (req, res) => {
    var sql = `select notice.id, notice.school_info_id, session.session_year, notice.section_id, class.class_name,  notice.notice_headline, notice.notice_description, notice.publishing_date
    from notice
    join class on notice.class_id=class.id 
    join section on notice.section_id=section.id
    join session on notice.session_id=session.id
    where notice.student_id="${req.query.student_id}"
    order by notice.id
    ;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  // app.get("/api/routine/teacher", (req, res) => {
  //   var sql = `select routine.id, routine.section_id, class.class_name,  day.day, period.period_code, period.start_time, period.end_time, routine.subject_id, subject.subject_name, teacher.first_name, room, session.session_year, shift.shift_name
  //     from routine
  //     join class on routine.class_id=class.id
  //     join section on routine.section_id=section.id
  //     join day on routine.day_id=day.id
  //     join period on routine.period_id=period.id
  //     join subject on routine.subject_id=subject.id
  //     join teacher on routine.teacher_id=teacher.id
  //     join session on routine.session_id=session.id
  //     join shift on routine.shift_id=shift.id
  //     where routine.teacher_id="${req.query.teacher_id}"
  //     order by routine.day_id
  //     ;`;
  //   con.query(sql, function (err, result, fields) {
  //     if (err) throw err;
  //     res.send(result);
  //   });
  // });
  // app.get("/api/routine/teacher/today", (req, res) => {
  //   var sql = `select routine.id, routine.section_id, class.class_name,  day.day, period.period_code, period.start_time, period.end_time, routine.subject_id, subject.subject_name, teacher.first_name, room, session.session_year, shift.shift_name
  //     from routine
  //     join class on routine.class_id=class.id
  //     join section on routine.section_id=section.id
  //     join day on routine.day_id=day.id
  //     join period on routine.period_id=period.id
  //     join subject on routine.subject_id=subject.id
  //     join teacher on routine.teacher_id=teacher.id
  //     join session on routine.session_id=session.id
  //     join shift on routine.shift_id=shift.id
  //     where routine.teacher_id="${req.query.teacher_id}" and day.day like "${req.query.today}"
  //     order by routine.id
  //     ;`;
  //   con.query(sql, function (err, result, fields) {
  //     if (err) throw err;
  //     res.send(result);
  //   });
  // });
  // app.get("/api/routine/student", (req, res) => {
  //   var sql = `select routine.id, routine.section_id, class.class_name,  day.day, period.period_code, period.start_time, period.end_time, routine.subject_id, subject.subject_name, teacher.first_name, room, session.session_year, shift.shift_name
  //     from routine
  //     join class on routine.class_id=class.id
  //     join section on routine.section_id=section.id
  //     join day on routine.day_id=day.id
  //     join period on routine.period_id=period.id
  //     join subject on routine.subject_id=subject.id
  //     join teacher on routine.teacher_id=teacher.id
  //     join session on routine.session_id=session.id
  //     join shift on routine.shift_id=shift.id
  //     where routine.section_id="${req.query.section_id}"
  //     order by routine.day_id
  //     ;`;

  //   con.query(sql, function (err, result, fields) {
  //     if (err) throw err;
  //     res.send(result);
  //   });
  // });

  app.post("/api/notice/individual", authenticateToken, (req, res) => {
    var school_info_id = req.body.school_info_id;
    var class_id = req.body.class_id;
    var section_id = req.body.section_id;
    var student_id = req.body.student_id;
    var session_id = req.body.session_id;
    var headline = req.body.headline;
    var description = req.body.description;
    var date = req.body.date;
    var uid = req.body.uid;

    var sql = `INSERT INTO notice (school_info_id, class_id, section_id, student_id, session_id, notice_headline, notice_description, publishing_date, user_code) VALUES ("${school_info_id}", "${class_id}", "${section_id}", "${student_id}", "${session_id}", "${headline}", "${description}", "${date}", "${uid}" )`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.json({ status: "success" });
    });
  });
  app.post("/api/notice", authenticateToken, (req, res) => {
    var school_info_id = req.body.school_info_id;
    var class_id = req.body.class_id;
    var section_id = req.body.section_id;
    var students = req.body.students;
    var session_id = req.body.session_id;
    var headline = req.body.headline;
    var description = req.body.description;
    var date = req.body.date;
    var uid = req.body.uid;

    var sql =
      "INSERT INTO `notice` (`session_id`, `school_info_id`, `class_id`, `section_id`, `student_id`, `notice_headline`, `notice_description`, `publishing_date`, `user_code`) VALUES ";
    students.map((st_id) => {
      sql += `("${session_id}", "${school_info_id}", "${class_id}", "${section_id}", "${st_id}", "${headline}", "${description}", "${date}", "${uid}"),`;
    });
    sql = sql.slice(0, -1);

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.json({ status: "success" });
    });
  });
};
