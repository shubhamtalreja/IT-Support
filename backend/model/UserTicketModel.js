const mongoose = require("mongoose");

const userTicketSchema = new mongoose.Schema({
  description: { type: String },
  title: { type: String },
  reporter: { type: String },
  priority: { type: String },
  images: {
    data: Buffer,
    contentType: String,
  },
});

const userTicketModel = mongoose.model("ticketForm", userTicketSchema);

module.exports = userTicketModel;
