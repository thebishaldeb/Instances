var mongoose = require('mongoose');

var dislikeSchema = mongoose.Schema({
    dislike: Boolean,
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

module.exports = mongoose.model("Dislikes", dislikeSchema);