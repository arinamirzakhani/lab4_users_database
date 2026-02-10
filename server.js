const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const usersRouter = require("./routes/users.routes");

const app = express();
app.use(express.json());

// Route
app.use("/users", usersRouter);

// Health check
app.get("/", (req, res) => res.json({ status: "OK", app: "lab4_users_database" }));

const PORT = process.env.PORT || 8081;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.DB_NAME || undefined,
    });

  
    await mongoose.connection.db.command({ ping: 1 });

    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
