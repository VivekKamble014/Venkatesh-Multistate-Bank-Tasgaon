
import dotenv from "dotenv";
dotenv.config(); // ✅ Correct way to use dotenv in ES Modules

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js"; // Ensure the file extension is `.js`
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js"; // ✅ Ensure this is an ES module


import adminRoutes from "./routes/adminRoutes.js";





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


app.use("/", adminRoutes);


// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});





// ✅ Start Server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));