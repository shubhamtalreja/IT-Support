const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb+srv://IT-support:9560249747@cluster0.wzrnop1.mongodb.net/test");
module.exports = connection;
