const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// 🔐 Load env variables
dotenv.config();

// 🔌 Connect DB
connectDB();

const app = express();

// --------------------------------------------------
// 🌍 Middleware
// --------------------------------------------------
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

// --------------------------------------------------
// 📌 Routes
// --------------------------------------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/moods", require("./routes/moodRoutes"));
app.use("/api/journals", require("./routes/journalRoutes"));
app.use("/api/insights", require("./routes/insightRoutes"));
app.use("/api/support", require("./routes/supportRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// --------------------------------------------------
// 🏠 Health Check
// --------------------------------------------------
app.get("/", (req, res) => {
  res.send("🚀 MindTuneX API is running...");
});

// --------------------------------------------------
// ❌ Global Error Handler (IMPORTANT)
// --------------------------------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// --------------------------------------------------
// 🚀 Start Server
// --------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});