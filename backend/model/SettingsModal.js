const mongoose = require("mongoose")

const SettingSchema = new mongoose.Schema({
    Host: {type : String, required : true},
    port:{type:String,required:true},
    email : {type : String, required : true},
    password : {type : String, required : true},
})

const SettingsModal = mongoose.model("Settings", SettingSchema)


module.exports = SettingsModal