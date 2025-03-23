require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./src/routes/auth");
const todoRoutes = require("./src/routes/todos");
const userRoutes = require("./src/routes/user");
const authMiddleware = require("./src/middleware/auth");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", authMiddleware, todoRoutes);
app.use("/api/user", authMiddleware, userRoutes);

// Handle wrong paths
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("http://localhost:5000/login.html");
});