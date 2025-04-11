const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Task = require("../models/Task")
router.get("/get-employee", async (req, res) => {
  const { role } = req.query;

  if (!role) {
    return res.status(400).json({ error: "Missing jobRole in query!" });
  }

  try {
    const employees = await Employee.find({ jobRole: role }).select("employeeID email fullName department jobRole");

    if (employees.length === 0) {
      return res.status(404).json({ message: "No employees found with this job role." });
    }

    res.status(200).json(employees);
  } catch (err) {
    console.error("❌ Error fetching employees by jobRole:", err); // Add this line for full debug
    res.status(500).json({ error: "Server error while fetching employees." });
  }
});

// GET all employees
router.get('/get-all-employees', async (req, res) => {
  try {
    const allEmployees = await Employee.find({});
    res.json(allEmployees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all employees' });
  }
});

router.post('/add-task', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(500).json({ message: 'Failed to add task' });
  }
});

// Get tasks assigned to a specific employee
router.get('/get-tasks-by-email', async (req, res) => {
  const { email } = req.query;

  try {
    const tasks = await Task.find({ employeeEmail: email });
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// routes/userRoutes.js or wherever appropriate
router.get("/get-all-emails", async (req, res) => {
  try {
    const users = await Employee.find({}, "email fullName department jobRole"); // fetch only email field
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch emails", error: err });
  }
});

router.put('/update-task-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedAt } = req.body;

    await Task.findByIdAndUpdate(id, {
      status,
      completedAt: completedAt || null,
    });

    res.status(200).json({ message: `Task status updated to ${status}` });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Failed to update task status" });
  }
});

router.get("/total-employees", async (req, res) => {
  try {
    const count = await Employee.countDocuments(); // adjust as needed
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting employees:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get('/count', async (req, res) => {
  try {
    const count = await Task.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/taskRoutes.js
router.get("/by-email", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const tasks = await Task.find({ employeeEmail: email });
    

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this email" });
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks by email:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Example: routes/taskRoutes.js or wherever you handle this PUT request
router.put("/updatetask/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const update = {
      status,
    };

    // Add completedAt timestamp if status is Completed
    if (status === "Completed") {
      update.completedAt = new Date();
    } else {
      update.completedAt = null; // Optional: clear the date if task is re-opened
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});


router.delete('/delete-task/:id', async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully', result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// PUT /api/update-task/:id
router.put('/update-task/:id', async (req, res) => {
  try {
    const { taskTitle, taskDescription, dueDate } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { taskTitle, taskDescription, dueDate },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});
module.exports = router;