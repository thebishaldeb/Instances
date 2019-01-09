var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
var middlewareObj = {};

// FUNCTIONS
middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
  };

middlewareObj.ifOwned = function (req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, found){
            if(err){
                res.redirect("back"); 
            } else {
                if(found.author.id.equals(req.user._id)){
                    next(); 
                }
                else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
} 


middlewareObj.ifOwnedComment = function (req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, found){
            if(err){
                res.redirect("back"); 
            } else {
                if(found.author.id.equals(req.user._id)){
                    next(); 
                }
                else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
} 

module.exports = middlewareObj;