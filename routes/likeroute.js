var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Blog = require("../models/blogmodel"),
    Likes = require("../models/likemodel"),
    middleware = require("../middleware");

router.post("/", middleware.isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, found) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            Likes.count({ "id": found._id, "author.id": req.user._id, "like": true }, function(err, count1) {
                if (err) {
                    console.log(err);
                    res.redirect("/blogs");
                } else {
                    Likes.count({ "id": found._id, "author.id": req.user._id, "like": false }, function(err, count2) {
                        if (err) {
                            console.log(err);
                            res.redirect("/blogs");
                        } else {
                            if (count1 == 0) {
                                if (count2 != 0) {
                                    Likes.deleteOne({ "id": found._id, "author.id": req.user._id, "like": false }, function(err) {
                                        console.log("Dislike deleted: ");
                                        Likes.count({ "id": found._id, "like": false }, function(err, count3) {
                                            console.log("Total dislikes: " + count3);
                                            found.dislikes = count3;
                                        })
                                    })
                                }
                                Likes.create({
                                    "author.id": req.user._id,
                                    "author.username": req.user.username,
                                    "id": found._id,
                                    "like": true
                                }, function(err, like) {
                                    if (err) {
                                        console.log(err);
                                        res.redirect("/blogs");
                                    } else {
                                        Likes.count({ "id": found._id, "like": true }, function(err, count3) {
                                            console.log("Total likes: " + count3);
                                            found.likes = count3;
                                            found.save();
                                            console.log("Successfully liked");
                                            res.redirect("/blogs/" + found._id);
                                        })
                                    }
                                })
                            } else {
                                Likes.deleteOne({ "id": found._id, "author.id": req.user._id, "like": true }, function(err) {
                                    console.log("like deleted: ");
                                    Likes.count({ "id": found._id, "like": true }, function(err, count3) {
                                        console.log("Total likes: " + count3);
                                        found.likes = count3;
                                        found.save();
                                        console.log("You have already liked this page");
                                        res.redirect("/blogs/" + found._id);
                                    })
                                })
                            }
                        }
                    })
                }
            })
        }
    });
});

module.exports = router;