import express from "express";
import { updateProfileDetails, getEmployeeById } from "../controllers/employeeController.js";
import User from "../models/User.js"; // Import the Employee model
import Employee from "../models/Employee.js"; // Import the Employee model

import  authMiddleware from "../middlewares/authMiddleware.js"; // Import auth middleware


const router = express.Router();

router.post("/", updateProfileDetails);
router.get("/:id", getEmployeeById);


// 📌 Route to get an employee by email
router.get("/", async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email query parameter is required" });
        }

        console.log("🔍 Searching for email:", email);

        // ✅ Use the correct model and fetch full data
        const employee = await User.findOne({ email }).lean(); // Convert to plain object

        console.log("✅ Database result:", employee);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // ✅ Return full employee data, not just email
        return res.status(200).json(employee);
    } catch (error) {
        console.error("❌ Error fetching employee:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});


// Update profileUpdate field to false
router.patch("/updateProfileStatus", authMiddleware, async (req, res) => {
    try {
      const { email, profileUpdate } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
  
      // Find the employee by email and update profileUpdate field
      const updatedEmployee = await Employee.findOneAndUpdate(
        { email: email },
        { $set: { profileUpdate: profileUpdate } },
        { new: true } // Return updated document
      );
  
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found." });
      }
  
      res.status(200).json({ message: "Profile update status changed successfully.", employee: updatedEmployee });
    } catch (error) {
      console.error("Error updating profile status:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });





export default router;