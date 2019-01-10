var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Blog        = require("../models/blogmodel"),
    Comment     = require("../models/commentmodel"),
    middleware  = require("../middleware");

// NEW - ADD COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, found){
        if(err || !found){
            req.flash("error", "Blog not found");
            return res.redirect("back");
        } else {
            res.render("comments/new", {blog: found});
        }
    });
});

// CREATE - POST COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error","Something went wrong!");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    found.comments.push(comment);
                    found.save();
                    res.redirect("/blogs/" + found._id);
                }
            });
        }
    });
});

// EDIT COMMENT
router.get("/:comment_id/edit", middleware.ifOwnedComment, function(req, res){
    Blog.findById(req.params.id, function(err, found){
        if(err || !found){
            req.flash("error", "Blog not found!");
            return res.redirect("back"); 
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found!");
                res.redirect("blogs" + req.params.id); 
            } else {
                res.render("comments/edit",{Blog_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// UPDATE COMMENT
router.put("/:comment_id", middleware.ifOwnedComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, update){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/blogs/" + req.params.id); 
        }   
    });
});

// DELETE COMMENT
router.delete("/:comment_id", middleware.ifOwnedComment, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }   
    });
});

module.exports = router;