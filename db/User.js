const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    
name:String,
address:String,
city:String,
state:String,
licence_no:String,
Aadhar_no:String,
Email:String,
Phone_no:String,
imagePath: String 
    

})
module.exports = mongoose.model('driverinfo',UserSchema );