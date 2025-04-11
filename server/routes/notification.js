const express = require('express');
const router = express.Router();
const multer = require('multer');
const Notification = require('../models/Notification');

// Use memory storage for attachments (you can switch to disk if needed)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/notifications/send
router.post("/send", upload.single("attachment"), async (req, res) => {
  try {
    const file = req.file;

    // Debugging to confirm incoming fields
    console.log("REQ BODY:", req.body);

    const newNotification = new Notification({
      senderName: req.body.senderName,
      senderEmail: req.body.senderEmail,
      senderDepartment: req.body.senderDepartment,
      senderRole: req.body.senderRole,
      receiverName: req.body.receiverName,
      receiverEmail: req.body.receiverEmail,
      receiverDepartment: req.body.receiverDepartment,
      receiverRole: req.body.receiverRole,
      subject: req.body.subject,   // ✅ Corrected
      message: req.body.message,   // ✅ Corrected
      date: new Date(),
      attachment: file
        ? {
            data: file.buffer,
            contentType: file.mimetype,
            fileName: file.originalname,
          }
        : undefined,
    });

    await newNotification.save();
    res.status(201).json("Notification sent with attachment.");
  } catch (err) {
    console.error(err);
    res.status(500).json("Error saving notification.");
  }
});



// routes/notifications.js or controller
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  const sortOrder = req.query.sort === "asc" ? 1 : -1;

  try {
    const notifications = await Notification.find({ receiverEmail: email })
      .sort({ date: sortOrder });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Mark notification as seen
router.put('/mark-seen/:id', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isSeen: true });
    res.status(200).json({ message: "Marked as seen" });
  } catch (error) {
    console.error("Error marking as seen:", error);
    res.status(500).json({ message: "Failed to mark as seen" });
  }
});

// routes/notificationRoutes.js
router.post('/reply', async (req, res) => {
  try {
    const {
      senderName,
      senderEmail,
      senderDepartment,
      senderRole,
      receiverName,
      receiverEmail,
      receiverDepartment,
      receiverRole,
      originalSubject,
      originalMessage,
      replyMessage
    } = req.body;

    const newReply = new Notification({
      senderName,
      senderEmail,
      senderDepartment,
      senderRole,
      receiverName,
      receiverEmail,
      receiverDepartment,
      receiverRole,
      subject: `RE: ${originalSubject}`,
      message: `${replyMessage}\n\n----\nOriginal Message:\n${originalMessage}`,
      date: new Date(),
      isSeen: false
    });

    await newReply.save();
    res.status(201).json({ message: "Reply sent successfully" });
  } catch (err) {
    console.error("Error in reply route:", err);
    res.status(500).json({ error: "Failed to send reply" });
  }
});

// DELETE notification by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).send("Notification deleted");
  } catch (err) {
    res.status(500).send("Error deleting notification");
  }
});

module.exports = router;