const express = require('express');
const router = express.Router({
    mergeParams: true
});
var middleware = require("../middleware")
const User = require('../models/usermodel');
const mongoose = require('mongoose');
const moment = require('moment');

router.get('/:username', middleware.isLoggedIn, (req, res) => {
    User.findOne({
        username: req.params.username
    }).then(user1 => {
        res.render('profile/profile_show', {
            user1: user1,
            moment: moment
        })
    })
});

router.get('/edit/:id', middleware.isLoggedIn, (req, res) => {
    User.findOne({
        _id: req.params.id
    }).then(user => {
        res.render('profile/profile_edit', {
            user: user,
            moment: moment
        });
    })
})

router.put('/edit/:id', middleware.isLoggedIn, async(req, res) => {
    try {
        const user2 = await User.findOne({
            _id: req.params.id
        });
        if (req.body.username != user2.username) {
            const user1 = await User.findOne({
                username: req.body.username
            });
            if (!user1) {

                user2.username = req.body.username;
            } else {
                req.flash("error", "username already there");
                // res.redirect(`/user/edit/${user.username}`);
            }
        } else {
            user2.username = req.body.username;
        }

        if (req.body.email != user2.email) {
            const user1 = await User.findOne({
                email: req.body.email
            });
            if (!user1) {

                user2.email = req.body.email;
            } else {
                req.flash("error", "email already there");
                // res.redirect(`/user/edit/${user.username}`);
            }
        } else {
            user2.email = req.body.email;
        }
        user2.phonenumber = req.body.phonenumber;
        user2.profilepicture = req.body.profilepicture;
        user2.age = req.body.age;
        user2.role = req.body.role;
        user2.gender = req.body.gender;
        user2.birthdate = req.body.birthdate;
        user2.description1 = req.body.description1;
        user2.firstname = req.body.firstname;
        user2.lastname = req.body.lastname;

        const user3 = await user2.save();
        res.redirect(`/blogs`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;