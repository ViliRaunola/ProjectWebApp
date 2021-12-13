const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true 
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [mongoose.ObjectId],
    upVotes: [mongoose.ObjectId],
    downVotes: [mongoose.ObjectId],
    upVotesPosts: [mongoose.ObjectId],
    downVotesPosts: [mongoose.ObjectId],
    comments: [mongoose.ObjectId],
    admin: Boolean,
},{timestamps: true});

//Using time stapmps source: https://masteringjs.io/tutorials/mongoose/timestamps

module.exports = mongoose.model('User', userSchema);