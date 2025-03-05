import express from "express";
import { createEmployee, getEmployeeById } from "../controllers/employeeController.js";
import Employee from "../models/Employee.js"; // Import the Employee model



const router = express.Router();

router.post("/", createEmployee);
router.get("/:id", getEmployeeById);

// Corrected route for fetching employees by email
// router.get("/", async (req, res) => {
//     const { email } = req.query;

//     try {
//         if (!email) {
//             return res.status(400).json({ message: "Email query parameter is required" });
//         }

//         console.log("Searching for email:", email); // ✅ Debugging

//         const employee = await Employee.findOne({ email });


//         console.log("Database result:", employee); // ✅ Debugging

//         if (employee) {
//             res.json({ email: employee.email });
//         } else {
//             res.status(404).json({ message: "Employee not found" });
//         }
//     } catch (error) {
//         console.error("Error checking email:", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });


// 📌 Route to get an employee by email
router.get("/", async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email query parameter is required" });
        }

        console.log("🔍 Searching for email:", email);

        // ✅ Use the correct model and fetch full data
        const employee = await Employee.findOne({ email }).lean(); // Convert to plain object

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

export default router;