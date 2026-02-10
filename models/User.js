const mongoose = require("mongoose");

const isValidUrl = (value) => {
  // Accept only http or https URLs
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      minlength: [4, "username must be at least 4 characters"],
      maxlength: [100, "username must be at most 100 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true, // creates unique index (still handle duplicate error in API)
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "email must be a valid email address",
      ],
    },

    city: {
      type: String,
      required: [true, "city is required"],
      trim: true,
      match: [/^[A-Za-z ]+$/, "city must contain only alphabets and spaces"],
    },

    website: {
      type: String,
      required: [true, "website is required"],
      trim: true,
      validate: {
        validator: isValidUrl,
        message: "website must be a valid URL (http or https)",
      },
    },

    zipcode: {
      type: String,
      required: [true, "zipcode is required"],
      match: [/^\d{5}-\d{4}$/, "zipcode must be in format 12345-1234"],
    },

    phone: {
      type: String,
      required: [true, "phone is required"],
      match: [/^\d-\d{3}-\d{3}-\d{4}$/, "phone must be in format 1-123-123-1234"],
    },
  },
  { timestamps: true }
);


userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
