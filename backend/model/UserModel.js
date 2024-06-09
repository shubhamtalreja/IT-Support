const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{type : String, required : true},
    email : {type : String, required : true},
    password : {type : String, required : true},
    role:{type:String,required:true},
    employeeID:{type:String,required:true},
    id: { type: String, required: true },
    verifyToken: { type: String }
})

const UserModel = mongoose.model("user", userSchema)


module.exports = UserModel