const express = require("express");
const User = require("../models/User");

const router = express.Router();

/**
 * POST /users
 * Body example:
 * {
 *   "username":"john123",
 *   "email":"john@email.com",
 *   "city":"Toronto",
 *   "website":"https://example.com",
 *   "zipcode":"12345-1234",
 *   "phone":"1-123-123-1234"
 * }
 */
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    // Duplicate email (unique index)
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Validation failed",
        errors: {
          email: "email must be unique (this email already exists)",
        },
      });
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const formatted = {};
      for (const field in err.errors) {
        formatted[field] = err.errors[field].message;
      }
      return res.status(400).json({
        message: "Validation failed",
        errors: formatted,
      });
    }

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
