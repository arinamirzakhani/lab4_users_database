const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const raw = require("./UsersData.json");

// Support array OR object shape
const users = Array.isArray(raw) ? raw : (raw.users || raw.data || []);

async function seed() {
  console.log("=== SEED SCRIPT VERSION: v2 (count + rawResult) ===");

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "lab4",
    });

    console.log("✅ MongoDB connected");
    console.log("📦 Loaded records from JSON:", users.length);

    const before = await User.countDocuments();
    console.log("📌 users collection count BEFORE:", before);

    if (users.length === 0) {
      console.log("⚠️ No records to insert. JSON is empty or wrong shape.");
      return;
    }

    // Raw MongoDB result shows insertedCount clearly
    const rawResult = await User.collection.insertMany(users, { ordered: false });
    console.log("🧾 Raw insertMany result insertedCount:", rawResult.insertedCount);

    const after = await User.countDocuments();
    console.log("📌 users collection count AFTER:", after);

    console.log("✅ Done.");
  } catch (err) {
    console.error("❌ Seed failed.");

    // Bulk write errors (duplicates, etc.)
    if (err && err.writeErrors) {
      console.error("WriteErrors:", err.writeErrors.length);
      // show first 3 errors
      err.writeErrors.slice(0, 3).forEach((we, i) => {
        console.error(`--- Error ${i + 1} ---`);
        console.error(we.err?.errmsg || we.message || we);
      });
    } else {
      console.error(err.message || err);
    }
  } finally {
    await mongoose.disconnect();
  }
}

seed();
