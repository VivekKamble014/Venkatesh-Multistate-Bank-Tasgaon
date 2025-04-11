const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  employeeID: String,
  employeeEmail: String,
  employeeName: String,
  assignedBy: String,
  taskTitle: String,
  taskDescription: String,
  status: { type: String, default: 'Pending' },
  dueDate: Date,
  completedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);