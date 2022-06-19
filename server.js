const express = require("express");
const bodyparser = require("body-parser");
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const app = express();
var corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to epathshala application." });
});

require("./app/api/class.js")(app);
require("./app/api/section.js")(app);
require("./app/api/period.js")(app);
require("./app/api/subject.js")(app);
require("./app/api/teacher.js")(app);
require("./app/api/routine.js")(app);
require("./app/api/school_info.js")(app);
require("./app/api/day.js")(app);
require("./app/api/session.js")(app);
require("./app/api/shift.js")(app);
require("./app/api/attendance.js")(app);
require("./app/api/homework.js")(app);
require("./app/api/users.js")(app);
require("./app/api/student.js")(app);
require("./app/api/notice.js")(app);
require("./app/api/student_present_status")(app);
require("./app/api/exam_info")(app);
require("./app/api/admin")(app);
require("./app/api/markCount")(app);
require("./app/api/academicCalender")(app);
require("./app/api/school_admin")(app);
require("./app/api/super_admin")(app);
require("./app/api/exam.marks")(app);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
