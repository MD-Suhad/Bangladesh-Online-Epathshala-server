module.exports = (app) => {
    const con = require("../models/db");
    const authenticateToken = require("../middleware/middleware");
    app.get("/api/mark", authenticateToken, (req, res) => {
        var sql = `select exam_grade_sheet.id,student.student_code,school_info.address_division,CONCAT(student.first_name,' ' ,student.middle_name) as name, school_info.school_name, session.session_year,section.section_default_name, class.class_name,student.student_code,
        subject.subject_name,half_yearly_exam_sub,half_yearly_exam_mcq,monthly_class_test_average, (final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 as converted,final_exam_sub,final_exam_mcq,
        ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) as total,attendance_marks,	extra_curriculum,
    CASE
     WHEN ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) >= 80 THEN 'A+'
     WHEN ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) >= 70 AND ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) < 80 THEN 'A'
     WHEN ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) >= 60 AND ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) < 70 THEN 'B'
     WHEN ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) >= 50 AND ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) <60  THEN 'C'
     ELSE 'FAIL' END as grade,
     CASE
     WHEN ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) >= 80 THEN '5.00'
     WHEN ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) >= 70 AND ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) < 80 THEN '4.00'
     WHEN ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) >= 60 AND ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) < 70 THEN '3.50'
     WHEN ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) >= 50 AND ((final_exam_sub+final_exam_mcq+half_yearly_exam_sub+half_yearly_exam_mcq)/2*.7 +(attendance_marks+extra_curriculum+monthly_class_test_average)) <60  THEN '3.00'
     ELSE 'FAIL' END as gradePoint
    from exam_grade_sheet 
        join session on exam_grade_sheet.session_id=session.id
        join section on exam_grade_sheet.section_id=section.id
        join class on exam_grade_sheet.class_id=class.id
        join subject on exam_grade_sheet.subject_id=subject.id
        join student on exam_grade_sheet.student_id=student.id
        join school_info on exam_grade_sheet.school_info_id=school_info.id
    
        where student_code='${req.query.student_code}' and session_id="${req.query.session_id}"`;

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    });
    app.get("/api/mark/:id", authenticateToken, (req, res) => {
        var sql = `select exam_grade_sheet.id,student.student_code,school_info.address_division,CONCAT(student.first_name,' ' ,student.middle_name) as name, school_info.school_name, session.session_year,section.section_local_name, class.class_name,student.student_code,subject.subject_code,monthly_class_test_average,half_yearly_exam_sub 
        from exam_grade_sheet where id=?
        join session on exam_grade_sheet.session_id=session.id
        join section on exam_grade_sheet.section_id=section.id
        join class on exam_grade_sheet.class_id=class.id
        join subject on exam_grade_sheet.subject_id=subject.id
        join student on exam_grade_sheet.student_id=student.id
        join school_info on exam_grade_sheet.school_info_id=school_info.id
        `;

        con.query(sql, [req.params.id], (err, result, fields) => {
            if (err) { throw err; }

            res.send(result[0]);

        });
    });


    app.get("/api/grade", authenticateToken, (req, res) => {
        var sql = `select student_mark.id,number_Sum.num1,number_Sum.num2,mcq, (num1+num2) as total, (num1+num2)/2 as net_number, if(num1+num2>=40, "A","B") as grade, (num1+num2)/2*.70 as avg, if(num1+num2>=40, 5.00,4.00) as grade_point
        
        from student_mark 

        join number_Sum on student_mark.Grade=number_Sum.id
       
        order by  student_mark.id;`;

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    });
    app.get("/api/grade/:id", authenticateToken, (req, res) => {
        var sql = `select student_mark.id,number_Sum.num1,number_Sum.num2,mcq, (num1+num2) as total, (num1+num2)/2 as net_number, if(num1+num2>=40, "A","B") as grade, (num1+num2)/2*.70 as avg, if(num1+num2>=40, 5.00,4.00) as grade_point
        
        from student_mark 

        join number_Sum on student_mark.Grade=number_Sum.id
       
        order by  student_mark.id;`;

        con.query(sql, [req.params.id], (err, result, fields) => {
            if (err) throw err;
            res.json(result[0]);
        });
    });

} 