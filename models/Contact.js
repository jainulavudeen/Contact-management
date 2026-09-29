const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    contactId: {
      type: String,
      required: [true, "contactId is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // allows multiple contacts without an email
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Please provide a valid email address"],
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Contact", ContactSchema);
