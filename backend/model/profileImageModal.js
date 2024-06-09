const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "it"],
    required: true
  }
});

const Profile = mongoose.model("ProfileImage", profileSchema);

module.exports = Profile;
