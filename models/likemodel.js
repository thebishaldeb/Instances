var mongoose = require('mongoose');

var likeSchema = mongoose.Schema({
    like: Boolean,
    id  : {
        type    : mongoose.Schema.Types.ObjectId,
        ref     : "Blog"
    },
    author  : {
        id  : {
            type    : mongoose.Schema.Types.ObjectId,
            ref     : "User"
        },
        username    : String
    }
})

module.exports = mongoose.model("Likes", likeSchema);