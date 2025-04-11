import express from "express";
import { sendOTP, verifyOTP } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import Employee from "../models/Employee.js"; // Ensure the correct default export
import User from "../models/User.js"; // Import the Employee model

const router = express.Router();

export default router;
// Send OTP to Admin
router.post("/send-otp", sendOTP);

// Verify OTP and Login
router.post("/verify-otp", verifyOTP);

// Protected Admin Route (Test if authentication works)
router.get("/AdminDashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard!" });
});

router.get("/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Employee.findOne({ email }); // Ensure "Admin" is correctly imported
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// 📌 Route to get all employees
// router.get("/users", async (req, res) => {
//   try {
//       console.log("🔍 Fetching all employees...");

//       // ✅ Fetch all employees from the database
//       const employees = await User.find().lean(); // Convert to plain objects for better performance

//       console.log("✅ Retrieved employees:", employees.length);

//       if (employees.length === 0) {
//           return res.status(404).json({ message: "No employees found" });
//       }

//       return res.status(200).json(employees);
//   } catch (error) {
//       console.error("❌ Error fetching employees:", error.message);
//       return res.status(500).json({ error: "Internal server error" });
//   }
// });


router.get("/users", async (req, res) => {
  try {
    const users = await User.find().lean(); 
    const employees = await Employee.find().lean(); 

    // Merge users and employees based on email
    const mergedData = users.map((user) => {
      const employee = employees.find(emp => emp.email === user.email);

      return {
        ...user,
        fullName: employee?.fullName || "N/A",
        department: employee?.department || "N/A",
        jobRole: employee?.jobRole || "N/A",
        branchName: employee?.branchName || "N/A",
        joinDate: employee?.joinDate || "N/A",
      };
    });

    res.json(mergedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// ✅ Update User Role
router.put("/users/:id/update-role", async (req, res) => {
  try {
    const { isAdmin } = req.body;
    await User.findByIdAndUpdate(req.params.id, { isAdmin });
    res.json({ message: `User role updated to ${isAdmin ? "Admin" : "User"}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update role" });
  }
});

// ✅ Block User
router.put("/users/:id/block", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isVerified: false });
    res.json({ message: "User blocked" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ✅ Delete User
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});


// Get unique branches, departments, and job roles
router.get("/filters", async (req, res) => {
  try {
    // const branches = await Employee.distinct("branchName");
    const departments = await Employee.distinct("department");
    const jobRoles = await Employee.distinct("jobRole");
    res.json({ branches, departments, jobRoles });
  } catch (error) {
    res.status(500).json({ error: "Error fetching filters" });
  }
});

// Get employees based on filters
router.get("/search", async (req, res) => {
  try {
    const { branch, department, jobRole, employee } = req.query;
    let filter = {};
    
    if (branch) filter.branchName = branch;
    if (department) filter.department = department;
    if (jobRole) filter.jobRole = jobRole;
    if (employee) filter.fullName = { $regex: employee, $options: "i" }; // Case-insensitive search

    const employees = await Employee.find(filter);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Error fetching employees" });
  }
});


router.put("/users/:id/unblock", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to unblock user" });
  }
});