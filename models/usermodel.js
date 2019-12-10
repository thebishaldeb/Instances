var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    firstname:  {
        type: String
    },
    lastname: {
        type: String
    },
    phonenumber: {
        type: String
    },
    profilepicture:  {
        type: String
    },
    
    age:  {
        type: String
    },
    gender:  {
        type: String
    },
    description1 : {
        type: String
    },
    birthdate: {
        type: Date,
        default: Date.now
    },
    role:  {
        type: String
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);