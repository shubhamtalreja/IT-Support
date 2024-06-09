const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  ticketId: { type: Number },
  employeeId: { type: String },
  comments: [
    {
      commentId: { type: Number, unique: true, sparse: true },
      commentedBy: { type: String },
      comment: { type: String },
      time: { type: String },
      date: { type: String },
      id: false, // Disable the default ObjectId for comments
    },
  ],
});

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;
