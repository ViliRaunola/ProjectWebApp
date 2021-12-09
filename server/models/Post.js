const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let postSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    creatorUsername: {type: String},
    upVotes: [mongoose.ObjectId],
    downVotes: [mongoose.ObjectId],
    creator: mongoose.ObjectId,
    comments: [mongoose.ObjectId]
},{timestamps: true});

//Using time stapmps source: https://masteringjs.io/tutorials/mongoose/timestamps

module.exports = mongoose.model('Post', postSchema);