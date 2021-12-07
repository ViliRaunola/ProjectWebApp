const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let commentSchema = new Schema({
    userId: mongoose.ObjectId,
    upVotes: [mongoose.ObjectId],
    downVotes: [mongoose.ObjectId],
    postId: mongoose.ObjectId,
    content: {
        type: String,
        required: true
    }
},{timestamps: true});

//Using time stapmps source: https://masteringjs.io/tutorials/mongoose/timestamps

module.exports = mongoose.model('Comment', commentSchema);