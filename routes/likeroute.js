var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Blog        = require("../models/blogmodel"),
    Likes       = require("../models/likemodel"),
    Dislikes    = require("../models/dislikemodel"),
    middleware  = require("../middleware");

    router.post("/", middleware.isLoggedIn, function(req, res){
        Blog.findById(req.params.id, function(err, found){
            if(err){
                console.log(err);
                res.redirect("/blogs");
            } else {
                Likes.count({"id":found._id,"author.id": req.user._id}, function(err, count){
                    console.log( "Number of likes: ", count );
                        Dislikes.count({"id":found._id,"author.id":req.user._id},function(err,count1){
                            console.log("Number of dislikes: ",count1);
                            if(count==0 && count1==0){
                                Likes.create(req.body.like, function(err, like){
                                    if(err){
                                        req.flash("error","Something went wrong!");
                                        console.log(err);
                                    } else {
                                        like.author.id = req.user._id;
                                        like.author.username = req.user.username;
                                        like.id = found._id;
                                        like.save();
                                        found.likes.push(like);
                                        found.save();
                                        res.redirect("/blogs/" + found._id);
                                    }
                                });
                            }
                            else{
                                console.log("You have already disliked this blog");
                                res.redirect("/blogs/"+found._id);
                            }
                        })
                });
                
            }
        });
    });

module.exports = router;

