const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  experience: String,
  profile: String,
  resumeUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  "user_profile",
  UserProfileSchema
);
