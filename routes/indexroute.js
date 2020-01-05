var express = require("express"),
    User = require("../models/usermodel"),
    passport = require("passport"),
    router = express.Router({ mergeParams: true });
multer = require('multer');

// DEFINING STORAGE FOR PROFILE PICTURE IN DISKSTORAGE
const profilepic_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/profile')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        //Saves the file
        cb(null, true);
    } else {
        //Rejects a file and does not throw an error
        cb(null, false);
        req.fileFilterError = true;
    }
}

var upload_profilepic = multer({ storage: profilepic_storage, fileFilter: fileFilter })


// HOME PAGE
router.get("/", function(req, res) {
    res.render("landing");
})

//REGISTRATION
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", upload_profilepic.single('profilepicture'), function(req, res){
    var {username , email, lastname , firstname , gender 
        , description , birthdate , role , age ,
         phonenumber} = req.body;
        if(req.fileFilterError) {
            req.flash("error", "Insert images only for profile picture");
            req.fileFilterError = false;
            return res.redirect("/register");
        }
        var newUser = new User({username , email, lastname , 
        firstname , gender , description , birthdate , role , age , 
        profilepicture : "../" + req.file.path.slice(7) , phonenumber});
        User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            if (err.errors.email) {
                req.flash("error", "Email is invalid");
            } else {
                req.flash("error", err.message);
            }
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome " + user.username);
            res.redirect("/blogs");
        })
    });
});

// LOGIN
router.get("/login", function(req, res){
    if (req.query.origin) {
        req.session.returnTo = req.query.origin;
    } else {
        req.session.returnTo = req.header('Referer');
    }
    res.render("login");
});

router.post("/login", passport.authenticate("local"),
    // {
    //     successRedirect: "/blogs",
    //     failureRedirect: "/login",
    //     failureFlash: true
    // }), 
    function(req, res){
        res.redirect(req.session.returnTo || '/blogs');
        delete req.session.returnTo;
});

//LOGOUT 
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/blogs");
});

module.exports = router;