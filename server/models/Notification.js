const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderName: String,
  senderEmail: String,
  senderDepartment: String,
  senderRole: String,
  receiverName: String,
  receiverEmail: String,
  receiverDepartment: String,
  receiverRole: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now },
  isSeen: { type: Boolean, default: false },
  attachment: {
    data: Buffer,
    contentType: String,
    fileName: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);