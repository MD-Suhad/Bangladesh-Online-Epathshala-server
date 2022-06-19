const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

const con = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

con.connect((err) => {
  if (!err) {
    console.log("DB connection succeeded.");
  } else
    console.log(
      "DB connection failed \n Error : " + JSON.stringify(err, undefined, 2)
    );
});

module.exports = con;
