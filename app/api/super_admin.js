module.exports = (app) => {

    const con = require('../models/db')
    const authenticateToken = require("../middleware/middleware");
    app.post("/api/organization", authenticateToken, (req, res) => {
        var Organization_type = req.body.Organization_type;
        var organization_code = req.body.organization_code;


        var sql = `INSERT INTO Organization_tpe (Organization_type,organization_code) VALUES ("${Organization_type}","${organization_code}")`;

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });

    app.post("/api/add_school", (req, res) => {
        var type_id = req.body.type_id;
        var school_code = req.body.school_code;
        var eiin = req.body.eiin;
        var administrator_id = req.body.administrator_id;
        var school_name = req.body.school_name;
        var short_name = req.body.short_name;
        var address_division = req.body.address_division;
        var address_district = req.body.address_district;
        var address_upazila = req.body.address_upazila;
        var address_village = req.body.address_village;
        var school_phone = req.body.school_phone;
        var school_email = req.body.school_email;
        var school_head_name = req.body.school_head_name;
        var school_head_phone = req.body.school_head_phone;
        var school_head_email = req.body.school_head_email;
        var contact_person_name = req.body.contact_person_name;
        var contact_person_phone = req.body.contact_person_phone;
        var contact_person_email = req.body.contact_person_email;
        var status = req.body.status;


        var sql = `INSERT INTO school_info (type_id,school_code,eiin,administrator_id,school_name,short_name,address_division,address_district,address_upazila,	address_village,school_phone,school_email,school_head_name,school_head_phone,school_head_email,contact_person_name,contact_person_phone,contact_person_email,status) VALUES ("${type_id}","${school_code}","${eiin}","${administrator_id}","${school_name}","${short_name}","${address_division}","${address_district}","${address_upazila}","${address_village}","${school_phone}","${school_email}","${school_head_name}","${school_head_phone}","${school_head_email}","${contact_person_name}","${contact_person_phone}","${contact_person_email}","${status})`;

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.json({ status: "success" });
        });
    });



}