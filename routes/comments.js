var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

//NEW - ADD COMMENT
router.get("/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: found});
        }
    });
});

//CREATE - POST COMMENT
router.post("/",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    found.comments.push(comment);
                    found.save();
                    res.redirect("/campgrounds/" + found._id);
                }
            });
        }
    });
});

// FUNCTIONS
function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;