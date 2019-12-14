var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Blog        = require("../models/blogmodel"),
    Dislikes    = require("../models/dislikemodel"),
    Likes       = require("../models/likemodel"),
    middleware  = require("../middleware");

    router.post("/", middleware.isLoggedIn, function(req, res){
        Blog.findById(req.params.id, function(err, found){
            if(err){
                console.log(err);
                res.redirect("/blogs");
            } else {
                Dislikes.count({"id":found._id,"author.id": req.user._id}, function(err, count){
                    console.log( "Number of dislikes: ", count );
                        Likes.count({"id":found._id, "author.id": req.user._id},function(err,count1){
                                console.log("Number of likes: ",count1);
                               if(count==0 && count1==0){
                                    Dislikes.create(req.body.dislike, function(err, dislike){
                                        if(err){
                                            req.flash("error","Something went wrong!");
                                            console.log(err);
                                        } else {
                                            dislike.author.id = req.user._id;
                                            dislike.author.username = req.user.username;
                                            dislike.id = found._id;
                                            dislike.save();
                                            found.dislikes.push(dislike);
                                            found.save();
                                            res.redirect("/blogs/" + found._id);
                                        }
                                    }); 
                               }
                               else{
                                console.log("You have already liked this blog");
                                res.redirect("/blogs/"+found._id);
                               }
                        });
                });
                
            }
        });
    });

module.exports = router;

