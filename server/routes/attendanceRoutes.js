const express = require("express");
const Attendance = require("../models/Attendance");
const router = express.Router();

// Mark Attendance
router.post("/mark", async (req, res) => {
  try {
    const { email, employeeId, image, markedBy } = req.body;

    // Validate required fields
    if (!email || !employeeId || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const currentDate = new Date().toISOString().split("T")[0]; 
    const currentTime = new Date().toLocaleTimeString(); // Format: HH:MM:SS

    // Check if attendance already marked for today
    const existingAttendance = await Attendance.findOne({ email, date: currentDate });
    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance already marked for today." });
    }

    // Create new attendance record
    const newAttendance = new Attendance({
      employeeId,
      email,
      date: currentDate,
      time: currentTime,
      image,
      isPresent: "Present", // Default value
      attendanceMarkedBy: markedBy || "User", // Defaults to "User" if not provided
    });

    await newAttendance.save();
    res.status(201).json({ message: "✅ Attendance marked successfully!" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "❌ Internal server error" });
  }
});

router.post("/mark-absent", async (req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const employees = await Employee.find();
  
      for (const employee of employees) {
        const existingAttendance = await Attendance.findOne({
          employeeId: employee._id,
          date: today,
        });
  
        if (!existingAttendance) {
          await Attendance.create({
            employeeId: employee._id,
            email: employee.email,
            status: "Absent",
            date: today,
          });
        }
      }
  
      res.json({ message: "All absentees have been marked." });
    } catch (error) {
      res.status(500).json({ message: "Error marking absentees", error });
    }
  });
  router.get("/status", async (req, res) => {
    const { email } = req.query;
  
    try {
        const today = new Date().toISOString().split("T")[0];   
      const attendance = await Attendance.findOne({
        email,
        date: today, // Filter for today's date
      });
  
      if (!attendance) {
        return res.json({ isPresent: "Absent" });
      }
  
      res.json({ isPresent: "Present" });
    } catch (error) {
      console.error("Error fetching attendance status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router.get("/history", async (req, res) => {
    const { email } = req.query;
  
    try {
      const attendanceRecords = await Attendance.find({ email }).sort({ date: -1 }); // Sort latest first
  
      res.json(attendanceRecords);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  router.get("/graph", async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  
    try {
      const attendanceRecords = await Attendance.find({ email }).sort({ date: 1 }); // Sorted ascending
  
      if (!attendanceRecords.length) {
        return res.status(404).json({ message: "No attendance records found." });
      }
  
      res.json({ attendance: attendanceRecords });
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



router.get('/by-email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const data = await Attendance.find({ email });
    res.json(data);
  } catch (error) {
    console.error("Error fetching attendance by email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.patch('/update-markedby/:id', async (req, res) => {
  const { markedByType, attendanceMarkedBy } = req.body;

  try {
    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      { markedByType, attendanceMarkedBy },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating markedByType:", err);
    res.status(500).json({ error: "Failed to update markedByType" });
  }
});

router.patch('/update-status/:id', async (req, res) => {
  const { isPresent, markedByType, attendanceMarkedBy } = req.body;

  try {
    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      { isPresent, markedByType, attendanceMarkedBy },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating attendance:", err);
    res.status(500).json({ error: "Failed to update attendance" });
  }
});

// Example Node.js/Express logic
// attendance.js route or controller file
router.get("/by-email/:email", async (req, res) => {
  const { email } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const query = { email };

    // Add date range only if both are present
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const records = await Attendance.find(query).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error("Error fetching filtered attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/calender", async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const attendance = await Attendance.find({ email });
    res.json({ success: true, attendance });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;