var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    app             = express();
    
//APP INITIALIZE
mongoose.connect("mongodb://localhost:27017/scenicguides", { useNewUrlParser: true });
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
seedDB();

// PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret  : "Let's move around and enjoy.",
    resave  : false,
    saveUninitialized   : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})
 
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
app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: found});
        }
    });
});

//CREATE - POST COMMENT
app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
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

//==============================
// AUTHENTICATION
//==============================

//REGISTER FORM
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    });
});

// LOGIN FORN
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT 
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});


// FUNCTIONS
function isLoggedIn (req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
};







app.listen(1500, function(){
    console.log("Your application is running at http://localhost:1500/ ");
});