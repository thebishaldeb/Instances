var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    app             = express();
    
//APP INITIALIZE
mongoose.connect("mongodb://localhost:27017/scenicguides", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create


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
            res.render("campgrounds", {campgrounds: allCapmgrounds});
        }
    });
});

//NEW - ADD SITE
app.get("/campgrounds/new",function(req, res){
    res.render("new");
});

//CREATE - CREATE SITE
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});


app.listen(1500, function(){
    console.log("Your application is running at http://localhost:1500/ ");
    console.log("Ctrl + Click on the the link to directly reach there.");
});