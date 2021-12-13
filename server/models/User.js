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
    posts: [mongoose.ObjectId], //Id's of posts that user has posted
    upVotes: [mongoose.ObjectId], //Id's of comments that user has voted on
    downVotes: [mongoose.ObjectId], //Id's of comments that user has voted on
    upVotesPosts: [mongoose.ObjectId], //Id's of posts that user has voted on
    downVotesPosts: [mongoose.ObjectId], //Id's of posts that user has voted on
    comments: [mongoose.ObjectId],  //Id's of comments that user has posted
    admin: Boolean,
},{timestamps: true}); //Keeps track of creation and update times

//Using time stapmps source: https://masteringjs.io/tutorials/mongoose/timestamps

module.exports = mongoose.model('User', userSchema);