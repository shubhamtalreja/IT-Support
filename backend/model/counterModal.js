const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  seq: { type: Number, default: 0 },
});

const CommentCounterModel = mongoose.model("Counter", CounterSchema);

module.exports = CommentCounterModel;
