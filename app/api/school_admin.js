module.exports = (app) => {
    const con = require('../models/db')
    const authenticateToken = require("../middleware/middleware");
    app.post("/api/create_class", authenticateToken, (req, res) => {
        var school_type_id = req.body.school_type_id;
        var shift_id = req.body.shift_id;
        var class_code = req.body.class_code;
        var class_name = req.body.class_name;

        var sql = `INSERT INTO class (school_type_id, shift_id, class_code, class_name) VALUES ("${school_type_id}", "${shift_id}", "${class_code}", "${class_name}")`;

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });

    app.post("/api/create_section", authenticateToken, (req, res) => {
        var section_default_name = req.body.section_default_name;
        var sql = `INSERT INTO section (section_default_name) VALUES ("${section_default_name}")`;

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });

    app.post("/api/create_subject", authenticateToken, (req, res) => {
        var subject_code = req.body.subject_code;
        var subject_name = req.body.subject_name;
        var class_id = req.body.class_id;
        var school_type_id = req.body.school_type_id

        var sql = `INSERT INTO subject (subject_code,subject_name, class_id, school_type_id) VALUES ("${subject_code}","${subject_name}", "${class_id}", "${school_type_id}")`;

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });
    app.post("/api/create_period", authenticateToken, (req, res) => {
        var start_time = req.body.start_time;
        var end_time = req.body.end_time;
        var shift_id = req.body.shift_id;
        var period_code = req.body.period_code;
        var school_type_id = req.body.school_type_id

        var sql = `INSERT INTO period (school_type_id,shift_id,period_code) VALUES ("${school_type_id}","${shift_id}","${period_code}")`;

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });

    app.post("/api/add_teacher", (req, res) => {
        var teacher_code = req.body.teacher_code;
        var title = req.body.title;
        var first_name = req.body.first_name;
        var middle_name = req.body.middle_name;
        var last_name = req.body.last_name;
        var initial = req.body.initial;
        var subject_code = req.body.subject_code;
        var designation = req.body.designation;
        var department = req.body.department;
        var dob = req.body.dob;
        var blood_group = req.body.blood_group;
        var mpo_status = req.body.mpo_status;
        var index_no = req.body.index_no;
        var mobile = req.body.mobile;
        var email = req.body.email;
        var school_info_id = req.body.school_info_id;


        var sql = `INSERT INTO teacher (teacher_code,title,first_name,middle_name,last_name,initial,subject_code,designation,department,dob,blood_group,mpo_status,index_no,mobile,email,school_info_id) VALUES ("${teacher_code}","${title}","${first_name}","${middle_name}","${last_name}","${initial}","${subject_code}","${designation}","${department}","${dob}","${blood_group}","${mpo_status}","${index_no}","${mobile}","${email}","${school_info_id}")`;

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });
    app.post("/api/add_student", (req, res) => {
        var student_code = req.body.student_code;
        var first_name = req.body.first_name;
        var middle_name = req.body.middle_name;
        var last_name = req.body.last_name;
        var gender_id = req.body.gender_id;
        var present_address = req.body.present_address;
        var permanent_address = req.body.permanent_address;
        var father_phone_number = req.body.father_phone_number;
        var mother_name = req.body.mother_name;
        var mother_phone_number = req.body.mother_phone_number;
        var photo_id = req.body.photo_id;
        var dob = req.body.dob;
        var blood_group = req.body.blood_group;
        var father_name = req.body.father_name;
        var mobile_no = req.body.mobile_no;
        var email = req.body.email;
        var school_info_id = req.body.school_info_id;
        var division_id = req.body.division_id;


        var sql = `INSERT INTO student (student_code,first_name,middle_name,last_name,mobile_no,gender_id,division_id,email,present_address,permanent_address,father_name,father_phone_number,mother_name,mother_phone_number,dob,blood_group,photo_id,school_info_id) VALUES ("${student_code}","${first_name}","${middle_name}","${last_name}","${mobile_no}","${gender_id}","${division_id}","${email}","${present_address}","${permanent_address}","${father_name}","${father_phone_number}","${mother_name}","${mother_phone_number}","${dob}","${blood_group}","${photo_id}","${school_info_id}")`;

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });
}