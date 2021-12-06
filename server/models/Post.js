const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let postSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    upVotes: [mongoose.ObjectId],
    downVotes: [mongoose.ObjectId],
    comments: [mongoose.ObjectId]
},{timestamps: true});

//Using time stapmps source: https://masteringjs.io/tutorials/mongoose/timestamps

module.exports = mongoose.model('Post', postSchema);