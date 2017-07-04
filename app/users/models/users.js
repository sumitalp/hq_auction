var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose = require('passport-local-mongoose');

// set up a mongoose model and pass it using module.exports

var userSchema = new Schema({
	username: {type: String, required: true, unique: true},
    name: {type: String, required: false, default:""},
    email: {type: String},
    password: {type: String, required: true},
    admin: Boolean    
});

// Apply the uniqueValidator plugin to userSchema. 
userSchema.plugin(uniqueValidator);
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);