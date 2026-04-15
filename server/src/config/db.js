const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Better config options (modern Mongo settings)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast
      autoIndex: true, // dev only (disable in prod if needed)
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // 🔄 Connection events (VERY IMPORTANT 🔥)
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔁 MongoDB Reconnected");
    });

  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;