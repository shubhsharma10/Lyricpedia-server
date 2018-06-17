var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    userType: {type: String, default: 'Free'},  // "Admin" / "Free" / "Paid"
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber:String,
    address:String
}, {collection: 'user'});

module.exports = userSchema;