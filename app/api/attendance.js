module.exports = (app) => {
  const con = require("../models/db");
  const authenticateToken = require("../middleware/middleware");
  app.get("/api/attendance", authenticateToken, (req, res) => {
    con.query(
      "SELECT id, attendance FROM attendance",
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
  app.get("/api/attendance/all", authenticateToken, (req, res) => {
    con.query("SELECT * FROM attendance", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.get("/api/attendance/student", (req, res) => {
    var sql = `SELECT student_present_status.id, CONCAT( first_name, ' ', middle_name, ' ', last_name ) AS full_name, class_roll_no, student_code, mobile_no FROM student_present_status
    join student on student_present_status.student_id=student.id
    join school_info on student_present_status.school_info_id=school_info.id
    join class on student_present_status.class_id=class.id
    where section_id="${req.query.section_id}" and student_present_status.school_info_id="${req.query.school_info_id}" and class.id="${req.query.class_id}" 
   `;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.post("/api/attendance/student", authenticateToken, (req, res) => {
    var date = req.body.date;
    var time = req.body.time;

    var routine_id = req.body.routine_id;
    var attendance = req.body.attendance;
    var sql = `INSERT INTO attendance (date, time, student_present_status_id, routine_id, attendance) VALUES `;
    attendance.map((att) => {
      sql += `("${date}", "${time}", "${att.student_id}", "${routine_id}", "${att.attendance_status}" ),`;
    });
    sql = sql.slice(0, -1);
    sql += `on duplicate key 
    update 
    time = values(time),
    attendance = values(attendance)
    `;

    // console.log(sql);

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.json({ status: "success" });
    });
    //console.log(attendance);
  });

  app.get("/api/attendance/summary/all", authenticateToken, (req, res) => {
    var sql = `SELECT
    school_info.id, school_info.school_name,
      COUNT(*) as 'all', 
      COUNT(IF(attendance.attendance = 1, 1, NULL)) as 'present',
      COUNT(IF(attendance.attendance = 0, 1, NULL)) as 'absent',
      round( ( COUNT(IF(attendance.attendance = 1, 1, NULL)) / COUNT(*) ) * 100 ) as 'present_rate'
      FROM
      attendance
      join student_present_status on attendance.student_present_status_id=student_present_status.id
      join school_info on student_present_status.school_info_id=school_info.id
      
      group by school_info.id;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.get("/api/attendance/summary/school", (req, res) => {
    var sql = `SELECT
    school_info.id, school_info.school_name,section.section_default_name,class.class_name,
      COUNT(*) as 'all', 
      COUNT(IF(attendance.attendance = 1, 1, NULL)) as 'present',
      COUNT(IF(attendance.attendance = 0, 1, NULL)) as 'absent',
      round( ( COUNT(IF(attendance.attendance = 1, 1, NULL)) / COUNT(*) ) * 100 ) as 'present_rate'
      FROM
      attendance
      join student_present_status on attendance.student_present_status_id=student_present_status.id
      join school_info on student_present_status.school_info_id=school_info.id
      join section on student_present_status.section_id=section.id
      join class on student_present_status.class_id=class.id
      where school_info.id="${req.query.school_info_id}" and attendance.date="${req.query.date}"
      group by section.id,school_info.id,class.id;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.get(
    "/api/attendance/summary/section/today",
    authenticateToken,
    (req, res) => {
      var sql = `SELECT
    subject.subject_name, routine.subject_id, period.period_code, routine.start_time, attendance.time, teacher.id as t_id, teacher.initial,routine.id as r_id,
    COUNT(*) as 'all', 
    COUNT(IF(attendance.attendance = 1, 1, NULL)) as 'present',
    COUNT(IF(attendance.attendance = 0, 1, NULL)) as 'absent',
    round( ( COUNT(IF(attendance.attendance = 1, 1, NULL)) / COUNT(*) ) * 100 ) as 'present_rate'
    FROM
    attendance
    join student_present_status on attendance.student_present_status_id=student_present_status.id
    join section on student_present_status.section_id=section.id
    join routine on attendance.routine_id=routine.id
    join subject on routine.subject_id=subject.id
    join period on routine.period_id=period.id
    join teacher on routine.teacher_id=teacher.id
    join class on routine.class_id=class.id
    
    where section.id="${req.query.section_id}" and attendance.date="${req.query.date}" and class.id="${req.query.class_id}"
    group by routine.subject_id, routine.period_id, teacher.id, routine.id, attendance.time,class.id
    order by routine.period_id;`;
      con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      });
    }
  );
  app.get(
    "/api/attendance/summary/section/daterange",
    authenticateToken,
    (req, res) => {
      var sql = `SELECT
    attendance.date, subject.subject_name, routine.subject_id, period.period_code, routine.start_time, attendance.time, teacher.id as t_id, teacher.initial,routine.id as r_id,
    COUNT(*) as 'all', 
    COUNT(IF(attendance.attendance = 1, 1, NULL)) as 'present',
    COUNT(IF(attendance.attendance = 0, 1, NULL)) as 'absent',
    round( ( COUNT(IF(attendance.attendance = 1, 1, NULL)) / COUNT(*) ) * 100 ) as 'present_rate'
    FROM
    attendance
    join student_present_status on attendance.student_present_status_id=student_present_status.id
    join section on student_present_status.section_id=section.id
    join class on section.class_id=class.id
    join routine on attendance.routine_id=routine.id
    join subject on routine.subject_id=subject.id
    join period on routine.period_id=period.id
    join teacher on routine.teacher_id=teacher.id
    where section.id="${req.query.section_id}" and attendance.date between "${req.query.start_date}" and "${req.query.end_date}"
    group by attendance.date, routine.subject_id, routine.period_id, teacher.id, routine.id, attendance.time
    order by attendance.date, routine.period_id;`;
      con.query(sql, function (err, result, fields) {
        if (err) throw err;

        var att_by_date = [];
        var prev_date = "2022-05-23";
        var att_by_sub = {};

        res.send(result);
      });
    }
  );
  app.get("/api/attendance/section/absent", authenticateToken, (req, res) => {
    var sql = `SELECT
    CONCAT( student.first_name, ' ', student.middle_name, ' ', student.last_name ) AS full_name, class.class_name, section.section_default_name, student.mobile_no, attendance.attendance
    FROM
    attendance
    join student_present_status on attendance.student_present_status_id=student_present_status.id
    join student on student_present_status.student_id=student.id
    join section on student_present_status.section_id=section.id
    join class on student_present_status.class_id=class.id
    join routine on attendance.routine_id=routine.id
    join subject on routine.subject_id=subject.id
    join period on routine.period_id=period.id
    
    where section.id="${req.query.section_id}" and attendance.routine_id="${req.query.routine_id}" and attendance.date="${req.query.date}" and attendance.attendance=0;`;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
  app.get(
    "/api/attendance/student/individual",
    (req, res) => {
      var suborper = "";
      console.log(req.query.subject_id, req.query.period_id);
      if (req.query.subject_id != "null" && req.query.period_id != "null") {
        suborper = `and (period.id="${req.query.period_id}" and subject.id="${req.query.subject_id}")`;
      } else if (
        req.query.subject_id != "null" ||
        req.query.period_id != "null"
      ) {
        suborper = `and (period.id="${req.query.period_id}" or subject.id="${req.query.subject_id}")`;
      }

      var sql =
        `SELECT attendance.date, period.period_code, subject.subject_name, CONCAT( teacher.first_name, ' ', teacher.middle_name, ' ', teacher.last_name ) AS teacher_name, attendance, if(attendance>0, "P", "A") as present_status FROM attendance
    join routine on attendance.routine_id=routine.id
    join period on routine.period_id=period.id
    join subject on routine.subject_id=subject.id
    join teacher on routine.teacher_id=teacher.id
    where attendance.student_present_status_id="${req.query.student_id}" ` +
        suborper +
        ` and attendance.date between "${req.query.start_date}" and "${req.query.end_date}" 
      order by attendance.date asc;`;

      con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      });
    }
  );
};
