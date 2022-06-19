const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticateToken = require("../middleware/middleware");
module.exports = (app) => {
  const con = require("../models/db");
  app.post("/api/users/login", (req, res) => {
    var user_code = req.body.user_code;
    var password = req.body.password;
    var sql = `select user_code,user_type_id,password from users where user_code = "${user_code}"`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      if (!result.length) res.json({ errorMsg: "User does not exist" });
      else {
        if (result[0].password == password) {
          const accessToken = jwt.sign(
            { user: result[0] },
            process.env.ACCESS_TOKEN_SECRET
          );
          user = result[0];
          user.accessToken = accessToken;
          res.json(user);
        } else {
          res.json({ errorMsg: "Wrong password" });
        }
      }
    });
    //console.log(attendance);
  });

  //get user id
  app.get("/api/users/user_id", authenticateToken, (req, res) => {
    var user_code = req.query.user_code;
    var user_type = req.query.user_type;
    user_type = parseInt(user_type);
    var table_name = null;
    switch (user_type) {
      case 1:
        table_name = "student_present_status";
        break;
      case 2:
        table_name = "teacher";
        break;
      case 4:
        table_name = "school_admin";
        break;
      case 5:
        table_name = "Super_admin";
        break;
      case 6:
        table_name = "administrator";
        break;
    }

    var sql = null;

    switch (table_name) {
      case "student_present_status":
        sql = `select student_present_status.id ,class.id as class,school_info.school_name, student.school_info_id as school_id from student_present_status 
        inner join student on student_present_status.student_id=student.id
        join class on student_present_status.class_id=class.id
       inner join school_info on student_present_status.school_info_id=school_info.id
         where student.student_code = "${user_code}"`;
        break;
      case "teacher":
        sql = `select teacher.id,school_info.school_name,school_info.id  as school_id,school_info.type_id as school_type from teacher 
        inner join school_info on teacher.school_info_id=school_info.id
        where teacher_code = "${user_code}"`;
        break;
      case "administrator":
        sql = `select id from administrator where admin_code = "${user_code}"`;
        break;
      case "Super_admin":
        sql = `select id from Super_admin where super_admin_code="${user_code}"`;
        break;
      case "school_admin":
        sql = `select school_admin.id,admin_code,school_info.id as school_id,school_info.school_name,school_info.type_id as school_type,first_name,last_name from school_admin 
        join school_info on school_admin.school_info_id=school_info.id
        where admin_code="${user_code}"`;
        break;
    }

    // if ((table_name = "student_present_status")) {
    //   sql = `select student_present_status.id from student_present_status join student on student_present_status.student_id=student.id where student.student_code = "${user_code}"`;
    // }

    // if ((table_name = "teacher")) {
    //   sql = `select id from teacher where teacher_code = "${user_code}"`;
    // }

    //var sql = `select id from ${table_name} where ${table_name}_code = "${user_code}"`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      else {
        res.json(result[0]);
      }
    });
    //console.log(attendance);
  });

  app.post("/api/update_user", authenticateToken, (req, res) => {
    var Pass = req.body.Pass;

    var sql = `UPDATE users
    SET password = '${Pass}'
    WHERE user_code = "${req.query.user_code}"`;
    con.query(
      sql,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });

  app.get("/api/update_profile", (req, res) => {
    var Pass = req.query.Pass;

    var sql = `select id ,user_type_id from users
    WHERE user_code = "${req.query.user_code}"`;
    con.query(
      sql,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });
};
