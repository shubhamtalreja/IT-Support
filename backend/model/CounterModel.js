const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
    id:{type:String},
    seq:{type:Number}
})

const CounterModel = mongoose.model("counter",CounterSchema);

module.exports = CounterModel;