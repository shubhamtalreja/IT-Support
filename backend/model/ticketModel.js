const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  ticketId: { type: Number, unique: true, sparse: true },
  status: { type: String },
  assignee: {
    name: { type: String },
    assignee_employeeID: { type: String },
  },
  reporter: {
    name: { type: String },
    id: { type: String },
    employeeID: { type: String },
  },
  created_on: {
    time: { type: String },
    date: { type: String },
  },
  updated_on: {
    time: { type: String },
    date: { type: String },
  },
  comment: { type: String },
  ticketform: {
    reporterId: { type: String },
    reporter: { type: String },
    description: { type: String },
    title: { type: String },
    priority: { type: String },
    files: { type: Array },
  },
});

const ticketModel = mongoose.model("Ticket", TicketSchema);

module.exports = ticketModel;
