const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const raw = require("./UsersData.json");

const users = Array.isArray(raw) ? raw : (raw.users || raw.data || []);

async function seed() {
  console.log("=== SEED SCRIPT (Mongoose validated version) ===");

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

    // Map JSON structure to schema fields
    const mappedUsers = users.map((u, index) => ({
      username: u.username || `user${index}`,
      email: u.email,
      city: u.city || (u.address && u.address.city),
      website: u.website,
      zipcode: u.zipcode || (u.address && u.address.zipcode),
      phone: u.phone,
    }));

    // Insert using Mongoose (with validation)
    const result = await User.insertMany(mappedUsers, { ordered: false });
    console.log("🧾 Inserted records:", result.length);

    const after = await User.countDocuments();
    console.log("📌 users collection count AFTER:", after);

    console.log("✅ Done.");
  } catch (err) {
    console.error("❌ Seed failed.");

    // Validation or duplicate errors
    if (err && err.writeErrors) {
      console.error("WriteErrors:", err.writeErrors.length);
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
