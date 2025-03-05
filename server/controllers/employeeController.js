import Employee from "../models/Employee.js";
import { v4 as uuidv4 } from "uuid";

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const { email, fullName, mobile, dob, gender, department, jobRole,joinDate, address } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with this email already exists" });
    }

    const employee = new Employee({
      employeeID: uuidv4(),
      email,
      fullName,
      mobile,
      dob,
      gender,
      department,
      jobRole,
      joinDate,
      address,
    });

    await employee.save();
    res.status(201).json({ message: "Employee saved successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeID: req.params.id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};