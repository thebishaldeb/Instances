var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    validator = require('validator');

var UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid!')
            }
        }
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