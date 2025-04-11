const mongoose = require("mongoose");
const moment = require('moment-timezone');


const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  email: { type: String, required: true },
  image: { type: String },
date: { 
  type: String, 
  default: () => moment().tz('Asia/Kolkata').format('YYYY-MM-DD') 
},
time: { 
  type: String, 
  default: () => moment().tz('Asia/Kolkata').format('HH:mm:ss') 
},
  isPresent: { type: String, enum: ["Present", "Absent"], required: true },

  
  attendanceMarkedBy: { type: String, enum: ["Admin", "User"],default: 'User', required: true },
}, {
  timestamps: true // Optional: adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model("Attendance", attendanceSchema);