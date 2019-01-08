var express         = require("express"),
    bodyParser      = require("body-parser");
    app             = express();
    
//APP INITIALIZE
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var campgrounds = [
]
// HOME PAGE
app.get("/", function(req, res){
    res.render("landing");
})

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});


// ALL SITES PAGE
app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

//NEW SITE
app.get("/campgrounds/new",function(req, res){
    res.render("new");
});



app.listen(1500, function(){
    console.log("Your application is running at http://localhost:1500/ ");
    console.log("Ctrl + Click on the the link to directly reach there.");
});