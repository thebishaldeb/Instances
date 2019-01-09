var express     = require("express"),
    Campground  = require("../models/campground"),
    router      = express.Router({mergeParams: true});

// INDEX - SHOW ALL SITES
router.get("/", function(req, res){
    Campground.find({}, function(err, allCapmgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCapmgrounds});
        }
    });
});

//NEW - ADD SITE
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//CREATE - CREATE SITE
router.post("/", isLoggedIn, function(req, res){
    var name    = req.body.name;
    var image   = req.body.image;
    var desc    = req.body.description;
    var author  = {
        id      : req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - MORE INFO PAGE
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, found){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: found});
        }
    });
});

// EDIT SITE
router.get("/:id/edit",ifOwned, function(req, res){
    Campground.findById(req.params.id, function(err, found){
        res.render("campgrounds/edit",{campground: found});
    });
});

// UPDATE SITE
router.put("/:id", ifOwned, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, update){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }   
    });
});

// DELETE SITE
router.delete("/:id", ifOwned, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
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

function ifOwned (req, res, next) {
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

module.exports = router;