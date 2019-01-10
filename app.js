var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    app             = express();
    

// REQUIRED ROUTES
var campgroundsRoutes = require("./routes/campgrounds"),
    commentRoutes     = require("./routes/comments"),
    indexRoutes       = require("./routes/index");
    
//APP INITIALIZE
mongoose.connect("mongodb://localhost:27017/scenicguides", { useNewUrlParser: true });
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");

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
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
})


// ROUTES FILES
app.use(indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(1500, function(){
    console.log("Your application is running at http://localhost:1500/ ");
});