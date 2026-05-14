const mongoose = require("mongoose");

const studioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    phone: {
      type: String,
    },

    subscriptionPlan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    role: {
  type: String,
  enum: ["studio", "admin"],
  default: "studio"
},
    location: {
      type: String,
      default: "",
    },
    pricing: {
      type: Number,
      default: 0,
    },
    experience: {
      type: String,
      default: "",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    }

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Studio", studioSchema);
