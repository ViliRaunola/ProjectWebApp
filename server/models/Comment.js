const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let commentSchema = new Schema({
    userId: mongoose.ObjectId,
    upVotes: [mongoose.ObjectId], //Users that have voted
    downVotes: [mongoose.ObjectId], //Users that have voted
    postId: mongoose.ObjectId,
    content: {
        type: String,
        required: true
    },
    creatorUsername: {
        type: String,
        required: true
    }
},{timestamps: true}); //Keeps track of creation and update times

//Using time stapmps source: https://masteringjs.io/tutorials/mongoose/timestamps

module.exports = mongoose.model('Comment', commentSchema);