var express     = require("express"),
    Blog        = require("../models/blogmodel"),
    middleware  = require("../middleware"),
    router      = express.Router({mergeParams: true});
var moment = require('moment');

// INDEX - SHOW ALL INSTANCES
router.get("/", function(req, res){
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        } else {
            res.render("blogs/index", {blogs: allBlogs});
        }
    });
});

//NEW - ADD INSTANCE
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("blogs/new");
});

//CREATE - CREATE INSTANCE
router.post("/", middleware.isLoggedIn, async function(req, res){
    try{
        var name    = req.body.name;
        var image   = req.body.image;
        var desc    = req.body.description;
        var author  = {
            id      : req.user._id,
            username: req.user.username
        };
        var user;

       
        var newBlog = {name: name, image: image, description: desc, author: author, user : req.user._id};
        Blog.create(newBlog, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                res.redirect("/blogs");
            }
        });
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
   
});

// SHOW - MORE INFO PAGE
router.get("/:id", function(req, res){
    Blog.findById(req.params.id).populate('comments').populate('user',['description1','username']).exec(function(err, found){
        if(err || !found){
            console.log(err);
            req.flash("error", "Blog not found");
            res.redirect("back");
        } else {
            res.render("blogs/show", {blog: found, moment : moment});
        }
    });
});

// EDIT INSTANCE
router.get("/:id/edit", middleware.ifOwned, function(req, res){
    Blog.findById(req.params.id, function(err, found){
        res.render("blogs/edit",{blog: found});
    });
});

// UPDATE INSTANCE
router.put("/:id", middleware.ifOwned, function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, update){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }   
    });
});

// DELETE INSTANCE
router.delete("/:id", middleware.ifOwned, function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }   
    });
});  

module.exports = router;