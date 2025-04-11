
import dotenv from "dotenv";
dotenv.config(); // ✅ Correct way to use dotenv in ES Modules

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js"; // Ensure the file extension is `.js`
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js"; // ✅ Ensure this is an ES module
import  attendanceRoutes from "./routes/attendanceRoutes.js";


import adminRoutes from "./routes/adminRoutes.js";
import tasks from "./routes/task.js";

import notificationRoutes from "./routes/notification.js";


import cron from "node-cron";


// Schedule job to run daily at 10:01 AM
cron.schedule("1 10 * * *", async () => {
  try {
    console.log("Running scheduled task to mark absentees...");

    // Fetch all employees who haven't marked attendance today
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const employees = await Employee.find();

    for (const employee of employees) {
      const existingAttendance = await Attendance.findOne({
        employeeId: employee._id,
        date: today,
      });

      if (!existingAttendance) {
        // If no attendance found, mark as absent
        await Attendance.create({
          employeeId: employee._id,
          email: employee.email,
          status: "Absent",
          date: today,
        });

        console.log(`Marked absent: ${employee.email}`);
      }
    }
  } catch (error) {
    console.error("Error marking absentees:", error);
  }
});






const app = express();

// ✅ Middleware

app.use(express.json()); // Enables JSON request parsing
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(cors()); // Allows frontend requests




// ✅ Connect to MongoDB
connectDB();

// ✅ CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Import Routes
app.use("/api/auth", authRoutes);

app.use("/api/employees", employeeRoutes); // Correct route

app.use("/api/attendance", attendanceRoutes);

app.use("/api/notifications", notificationRoutes); // ✅ make sure this exists

app.use("/", adminRoutes);


app.use("/api", tasks);



// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});





// ✅ Start Server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));