var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    Campground      = require("./models/campground"),
    Comment      = require("./models/comment"),
    seedDB      = require("./seeds"),
    app             = express();
    
//APP INITIALIZE
mongoose.connect("mongodb://localhost:27017/scenicguides", { useNewUrlParser: true });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
seedDB();
 
// HOME PAGE
app.get("/", function(req, res){
    res.render("landing");
})

// INDEX - SHOW ALL SITES
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCapmgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCapmgrounds});
        }
    });
});

//NEW - ADD SITE
app.get("/campgrounds/new",function(req, res){
    res.render("campgrounds/new");
});

//CREATE - CREATE SITE
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - MORE INFO PAGE
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, found){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: found});
        }
    });
});

//=================================
//  COMMENTS ROUTES
//=================================

//NEW - ADD COMMENT
app.get("/campgrounds/:id/comments/new",function(req, res){
    Campground.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: found});
        }
    });
});

//CREATE - POST COMMENT
app.post("/campgrounds/:id/comments",function(req, res){
    Campground.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    found.comments.push(comment);
                    found.save();
                    res.redirect("/campgrounds/" + found._id);
                }
            });
        }
    });
});

app.listen(1500, function(){
    console.log("Your application is running at http://localhost:1500/ ");
    console.log("Ctrl + Click on the the link to directly reach there.");
});