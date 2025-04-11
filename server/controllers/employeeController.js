
import { v4 as uuidv4 } from "uuid";
import Employee from "../models/Employee.js"; // Import User Model



export const updateProfileDetails = async (req, res) => {
  try {
    const { email, fullName, mobile, dob, gender, department, jobRole, joinDate, address } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the user by email
    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileUpdate) {
      return res.status(400).json({ message: "Profile is already updated" });
    }

    // Auto-generate employeeID if not assigned
    let employeeID = user.employeeID;
    
    if (!employeeID) {
      const lastEmployee = await Employee.findOne().sort({ employeeID: -1 }).select("employeeID"); // Get last employee
      
      // Ensure lastEmployee exists and has a valid employeeID
      const lastEmployeeID = lastEmployee?.employeeID ? Number(lastEmployee.employeeID) : 1000;

      employeeID = lastEmployeeID + 1; // Assign new employee ID
    }

    // Update user details
    const updatedUser = await Employee.findOneAndUpdate(
      { email },
      {
        $set: {
          fullName,
          mobile,
          dob,
          gender,
          department,
          jobRole,
          joinDate ,
          address,
          employeeID, 
        },
        profileUpdate : true, // Mark profile as updated
      },
      { new: true }
    );

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Employee by Employee ID from Users Collection
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeID: req.params.employeeID });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};