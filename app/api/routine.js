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
  app.get("/api/routine/all", authenticateToken, (req, res) => {
    var sql = `select routine.id, routine.section_id,section.section_default_name, routine.teacher_id,end_time,start_time, class.class_name,day.day, period.period_code, period.start_time, period.end_time, routine.subject_id, subject.subject_name, teacher.first_name, room, session.session_year, shift.shift_name
    from routine
    join class on routine.class_id=class.id 
    join section on routine.section_id=section.id
    join day on routine.day_id=day.id
    join period on routine.period_id=period.id
    join subject on routine.subject_id=subject.id
    join teacher on routine.teacher_id=teacher.id
    join session on routine.session_id=session.id
    join shift on routine.shift_id=shift.id
    order by routine.id
    ;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/routine/admin-search", (req, res) => {
    var sql = `select routine.id, routine.section_id,section.section_default_name, routine.teacher_id,end_time,start_time, class.class_name,day.day, period.period_code, routine.start_time, routine.end_time, routine.subject_id, subject.subject_name, teacher.first_name, room, session.session_year, shift.shift_name,teacher.initial
    from routine
    join class on routine.class_id=class.id 
    join section on routine.section_id=section.id
    join day on routine.day_id=day.id
    join period on routine.period_id=period.id
    join subject on routine.subject_id=subject.id
    join teacher on routine.teacher_id=teacher.id
    join session on routine.session_id=session.id
    join shift on routine.shift_id=shift.id
    where routine.school_info_id="${req.query.school_info_id}" and routine.teacher_id="${req.query.teacher_id}" and routine.class_id="${req.query.class_id}" and routine.section_id="${req.query.section_id}" and routine.day_id="${req.query.day_id}" and routine.session_id="${req.query.session_id}"
    order by routine.id
    ;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });


  app.get("/api/routine/teacher", authenticateToken, (req, res) => {
    var sql = `select routine.id,section.section_default_name, routine.section_id, class.class_name,day.day, period.period_code, routine.start_time as start_time,routine.end_time as end_time, routine.subject_id, subject.subject_name, teacher.first_name, room, session.session_year, shift.shift_name
    from routine
    join class on routine.class_id=class.id 
    join section on routine.section_id=section.id
    join day on routine.day_id=day.id
    join period on routine.period_id=period.id
    join subject on routine.subject_id=subject.id
    join teacher on routine.teacher_id=teacher.id
    join session on routine.session_id=session.id
    join shift on routine.shift_id=shift.id
    where routine.teacher_id="${req.query.teacher_id}"
    order by routine.day_id
    ;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/routine/teacher/today", authenticateToken, (req, res) => {
    var sql = `select routine.id, routine.section_id,section.section_default_name, class.class_name,routine.class_id as class,  day.day, period.period_code, routine.start_time as start_time,routine.end_time as end_time, routine.subject_id, subject.subject_name, teacher.first_name, room, session.session_year, shift.shift_name
    from routine
    join class on routine.class_id=class.id 
    join section on routine.section_id=section.id
    join day on routine.day_id=day.id
    join period on routine.period_id=period.id
    join subject on routine.subject_id=subject.id
    join teacher on routine.teacher_id=teacher.id
    join session on routine.session_id=session.id
    join school_info on routine.school_info_id=school_info.id
    join shift on routine.shift_id=shift.id
    where routine.teacher_id="${req.query.teacher_id}" and day.day like "${req.query.today}" and routine.school_info_id="${req.query.school_info_id}"
   
    `;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/routine/school/today", authenticateToken, (req, res) => {
    var sql = `select routine.id, routine.section_id, class.class_name,class.class_code, day.day, period.period_code, period.start_time, period.end_time, routine.subject_id, subject.subject_name, teacher.initial, room, session.session_year, shift.shift_name
    from routine
    join class on routine.class_id=class.id 
    join section on routine.section_id=section.id
    join day on routine.day_id=day.id
    join period on routine.period_id=period.id
    join subject on routine.subject_id=subject.id
    join teacher on routine.teacher_id=teacher.id
    join session on routine.session_id=session.id
    join shift on routine.shift_id=shift.id
    where routine.school_info_id="${req.query.school_id}" and day.day like "${req.query.day}"
    order by routine.id 
    ;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/routine/school/today/sections", authenticateToken, (req, res) => {
    var sql = `select section.id as section_id, count(*) as class_today from attendance
    join routine on attendance.routine_id=routine.id
    join section on routine.section_id=section.id
    join day on routine.day_id=day.id
    where routine.school_info_id="${req.query.school_info_id}" and attendance.date="${req.query.today}"
    group by section.id
    order by section.id;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get("/api/routine/school/filter", authenticateToken, (req, res) => {
    var sql = `select routine.id, routine.section_id,section.section_default_name, class.class_name,day.day, period.period_code, routine.start_time, routine.end_time, routine.subject_id, subject.subject_name, teacher.initial, room, session.session_year, shift.shift_name
    from routine
    join class on routine.class_id=class.id 
    join section on routine.section_id=section.id
    join day on routine.day_id=day.id
    join period on routine.period_id=period.id
    join subject on routine.subject_id=subject.id
    join teacher on routine.teacher_id=teacher.id
    join session on routine.session_id=session.id
    join shift on routine.shift_id=shift.id
    where routine.school_info_id="${req.query.school_info_id}"
   
    ;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.get("/api/routine/student", authenticateToken, (req, res) => {
    var sql = `select routine.id, routine.section_id,section.section_default_name,teacher.initial, class.class_name, day.day, period.period_code,routine.start_time,routine.end_time,  routine.subject_id, subject.subject_name, teacher.first_name, room, session.session_year, shift.shift_name
    from routine
    join class on routine.class_id=class.id
    join section on routine.section_id=section.id
    join day on routine.day_id=day.id
    join period on routine.period_id=period.id
    join school_info on routine.school_info_id=school_info.id
    join subject on routine.subject_id=subject.id
    join teacher on routine.teacher_id=teacher.id
    join session on routine.session_id=session.id
    join shift on routine.shift_id=shift.id
    where routine.section_id="${req.query.section_id}" and class.id="${req.query.class_id}" and school_info.id="${req.query.school_info_id}"
    order by routine.day_id
    ;`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.post("/api/routine/all", authenticateToken, (req, res) => {
    var class_id = req.body.class_id;
    var section_id = req.body.section_id;
    var day_id = req.body.day_id;
    var period_id = req.body.period_id;
    var subject_id = req.body.subject_id;
    var teacher_id = req.body.teacher_id;
    var room = req.body.room;
    var school_info_id = req.body.school_info_id;
    var session_id = req.body.session_id;
    var shift_id = req.body.shift_id;
    var start = req.body.start;
    var end = req.body.end;

    var sql = `INSERT INTO routine (class_id, section_id, day_id, period_id,start_time,end_time, subject_id, teacher_id, room, school_info_id, session_id, shift_id) VALUES ("${class_id}", "${section_id}", "${day_id}", "${period_id}","${start}","${end}", "${subject_id}", "${teacher_id}", "${room}", "${school_info_id}", "${session_id}", "${shift_id}" )`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.json({ status: "success" });
    });
  });
};
