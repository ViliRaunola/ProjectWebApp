var express = require('express');
var router = express.Router();
var User = require('../models/User')
var Post = require('../models/Post')
var Comment = require('../models/Comment')
var passwordValidator = require('password-validator');
var schema = new passwordValidator(); //Passport validation usage source: https://www.npmjs.com/package/password-validator
var bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator'); //Source on express validator: https://express-validator.github.io/docs/
const jwt = require("jsonwebtoken");
const passport = require('passport'); //Source on passport usage: http://www.passportjs.org/packages/passport-jwt/

//Giving requirements to the password
schema
    .is().min(10)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()



//Route for getting user information. Not protected
router.get('/user/public/:id', (req, res, next) => {
    User.findOne({_id: req.params.id}, (err, user) => {
        if(err) throw err
        return res.json({user: {id: user._id, 
            name: user.name,
            email: user.email,
            username: user.username,
            created: user.createdAt,
            }})
    })
})

//Route for voting comments
router.post('/vote', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //If the vote was up vote we add the post id to the user's upVotes list.
    //Since each user has only one vote we delete possible duplicates first.
    if(req.body.upVote){
        User.updateOne({_id: req.body.userId}, {$pull: {upVotes: req.body.commentId}}, (err) => { //Clears the user's upVotes list from this vote incase of duplicate
            if(err) throw err
            User.updateOne({_id: req.body.userId}, {$push: {upVotes: req.body.commentId}}, (err) => { //Adds the post id to User's upVotes list
                if(err) throw err;
                User.updateOne({_id: req.body.userId}, {$pull: {downVotes: req.body.commentId}}, (err) => { //Clears the user's downVotes list from this vote incase of duplicate
                    if(err) throw err;
                    Comment.updateOne({_id: req.body.commentId}, {$pull: {upVotes: req.body.userId}}, (err) => { //Clears the comments upVotes list from this vote incase of duplicate
                        if(err) throw err;
                        Comment.updateOne({_id: req.body.commentId}, {$push: {upVotes: req.body.userId}}, (err) => { //Adds the user id to Comment's upVote list
                            if(err) throw err;
                            Comment.updateOne({_id: req.body.commentId}, {$pull: {downVotes: req.body.userId}}, (err) => { //Clears the Comment's downVotes list from this vote incase of duplicate
                                if(err) throw err;
                                return res.json({success: true})
                            })
                        })
                    })
                })
            })
        })
    //Here the same is the same logic but for down vote
    }else if(req.body.downVote){
        User.updateOne({_id: req.body.userId}, {$pull: {downVotes: req.body.commentId}}, (err) => { //Clears the user's downVotes list from this vote incase of duplicate
            if(err) throw err
            User.updateOne({_id: req.body.userId}, {$push: {downVotes: req.body.commentId}}, (err) => { //Adds the post id to User's downVotes list
                if(err) throw err;
                User.updateOne({_id: req.body.userId}, {$pull: {upVotes: req.body.commentId}}, (err) => { //Clears the user's upVotes list from this vote incase of duplicate
                    if(err) throw err;
                    Comment.updateOne({_id: req.body.commentId}, {$pull: {downVotes: req.body.userId}}, (err) => { //Clears the comments downVotes list from this vote incase of duplicate
                        if(err) throw err;
                        Comment.updateOne({_id: req.body.commentId}, {$push: {downVotes: req.body.userId}}, (err) => { //Adds the user id to Comment's downVote list
                            if(err) throw err;
                            Comment.updateOne({_id: req.body.commentId}, {$pull: {upVotes: req.body.userId}}, (err) => { //Clears the Comment's upVotes list from this vote incase of duplicate
                                if(err) throw err;
                                return res.json({success: true})
                            })
                        })
                    })
                })
            })
        })
    }
})


//Route for deleting comments. Source for $pull https://docs.mongodb.com/manual/reference/operator/update/pull/
router.post('/comment/delete/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Comment.findOneAndRemove({_id: req.params.id}, (err) => {
        if(err) throw err}) //Removes the comment from collection
    Post.updateOne({_id: req.body.postId}, {$pull : {comments: req.params.id}} , (err) => {
        if(err) throw err}) //Removes the comment id from post collection
    User.updateOne({_id: req.body.userId}, {$pull : {comments: req.params.id, upVotes: req.params.id, downVotes: req.params.id}}, (err) => {
        if(err) throw err;
        return res.json({success: true})
    })//Goes through the user object removing the comment from the related user) 
})


//Route for deleting a post
router.post('/post/delete/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Post.findOneAndDelete({_id: req.params.id}, (err) => { //Deletes the post from Post collection
        if(err) throw err }) 
    User.updateOne({_id: req.body.userId}, {$pull: {posts: req.params.id}}, (err) => { //Deltes the post from User's document
        if(err) throw err
    })
    
    if(typeof req.body.comments !== 'undefined'){ //Source for checking if it is undefined: https://stackoverflow.com/questions/3390396/how-can-i-check-for-undefined-in-javascript
        req.body.comments.forEach(comment => {
            User.updateOne({_id: comment.userId}, {$pull: {comments: comment._id, upVotes: comment._id, downVotes: comment._id}}, (err) => { //Removing each comment from their user's documents
                if(err) return err;
            })  
            if(typeof comment.upVotes !== 'undefined'){
                comment.upVotes.forEach(userId => { //Goes through the users that have up voted the comment and delete the upvote counts from that user
                    User.updateOne({_id: userId}, {$pull: {upVotes: comment._id}}, (err) => {
                          if(err) return err;
                      })  
                  })
            }
           
            if(typeof comment.downVotes !== 'undefined'){
                comment.downVotes.forEach(userId => { //Goes through the users that have down voted the comment and delete the down vote counts from that user
                    User.updateOne({_id: userId}, {$pull: {downVotes: comment._id}}, (err) => {
                        if(err) return err;
                    })  
                })
            }
            Comment.findOneAndDelete({_id: comment._id}, (err) => { //Deletes the comment from database
                if(err) throw err;
            })

        })
        
    } 
    return res.json({success: true})
})

//Route for getting user information.
//If the JWT is valid the passport.authenticate will return the user from database.
//I will not send the full user object to the front end since it will contain the hashed password.
router.get('/user/profile',
            passport.authenticate('jwt', {session: false}),
            (req, res, next) => {
                return res.json({user: {id: req.user._id, 
                                        name: req.user.name,
                                        email: req.user.email,
                                        username: req.user.username,
                                        created: req.user.createdAt,
                                        updated: req.user.updatedAt,
                                        upVotes: req.user.upVotes,
                                        downVotes: req.user.downVotes}})
            });

//Gets all of the comments related to the post which id was given in the parameters.
router.get('/comment/:postId', (req, res, next) =>{
    Comment.find({'postId': req.params.postId}, (err, comments) => {
        if(err){
            console.log("Error occured during finding comments: " + err);
            throw err;
        }
        if(comments.length != 0){
            return res.json({comments: comments});
        }else{
            return res.json({message: 'No comments were found'})
        }
    });
});

//Adding a comment to the database. 
//Links the id's between the comment, creator and the post
router.post('/comment/add', 
            passport.authenticate('jwt', {session: false}),
            (req, res, next) => {
                //Adding the comment to database
                Comment.create({
                    userId: req.user._id,
                    postId: req.body.postId,
                    content: req.body.content,
                    creatorUsername: req.user.username
                },
                (err, createdComment) => {
                    if(err) throw err;
                    //Adding the comment id to user document that created it
                    User.findOneAndUpdate({'_id': req.user._id},
                    { $push: {'comments': createdComment._id}}, 
                    {timestamps:false}, //Making sure that the time stamp is not updated in this case, since I want it to update only when user information is changed
                    (err, user) => {
                        if(err) throw err;
                        //Adding the created comment id also to the post that it is linked to
                        Post.findOneAndUpdate({'_id': req.body.postId},
                            { $push: {'comments': createdComment._id}}, 
                            {timestamps:false}, 
                            (err, comment) => {
                                if(err) throw err;
                                return  res.status(200).json({success: true});                        
                        });
                    })
                })
});

//Authorised user can add posts. 
//When post is added its Id is saved to the user document.
router.post(
    '/post/add', 
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {

        //Adding the post to database
        Post.create({
            content: req.body.content,
            title: req.body.title,
            creator: req.user._id,
            creatorUsername: req.user.username
        },
        (err, createdPost) => {
            if(err) throw err;
            //Adding the post Id to the user document.
            User.findOneAndUpdate({'_id': req.user._id},
                                { $push: {'posts': createdPost._id}}, 
                                {timestamps:false}, //Making sure that the time stamp is not updated in this case, since I want it to update only when user information is changed
                                (err, user) => {
                                    if(err) throw err;
                                    return  res.status(200).json({success: true});
                                });

            
        });
    
});

//For getting all the posts from the database
router.get('/post/all', (req, res, next) => {
    Post.find({}, (err, posts) => {
        if(err){
            console.log("Error occured during finding posts: " + err);
            throw err;
        }
        if(posts.length != 0){
            return res.json({posts: posts});
        }else{
            return res.status(403).json({message: 'No posts were found'})
        }
    });
});

//Gets requested post based on the id
router.get('/post/:id', (req, res, next) => {
    Post.findOne({'_id': req.params.id}, (err, post) => {
        if(err){
            console.log("Error occured during finding post: " + err);
            throw err;
        }
        if(post){
            return res.json({post: post});
        }else{
            return res.status(403).json({message: "Didn't find a post with id:" + req.params['id']})
        }
    })
})

//For registering a new user to the database
router.post(
    '/user/register',
    body("email").isEmail(), //Middleware to check the email
    (req, res, next) => {

    //Checking if the email and password are acceptable. 
    //If not valid, a message is sent back containing information on what is not up to requirements
    const errors = validationResult(req); //Contains the errors that happened during the email check
    const errors_password = schema.validate(req.body.password, {list: true}); 
    if(!errors.isEmpty() || !errors_password.length == 0 ){
        return res.status(400).json( { errors: errors.array(), password: errors_password } );
    }

    //Checnking from the database that email isn't already in use.
    //If email isn't found in the database a new user can be created. 
    User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            console.log("Error occured during finding an user: " + err);
            throw err;
        }
        if(user){
            return res.status(403).json({email: "Email already in use"});
        } else {
            console.log("Creating a User");
            //Source on bcrypt: https://www.npmjs.com/package/bcryptjs
            //First bcrypt generates a salt that is now 12 long.
            bcrypt.genSalt(12, (err, salt) => {                 
                bcrypt.hash(req.body.password, salt, (err, hash) => { //Has the password using generated salt
                    if(err) throw err;
                    User.create(
                        {
                            name: req.body.name,
                            email: req.body.email,
                            username: req.body.username,
                            password: hash                  //When saving the user to the db I use the hashed version of the passoword!!
                        },
                        (err, ok) => {
                            if(err) throw err;
                            return  res.status(200).json({success: true});
                        }
                    );
                });
            });
        }
    });
});

//Route for user to login to the service
router.post('/user/login', (req, res, next) => {
    //Start by going through the database to find a matching user with the given email
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) throw err;
        //No user was found with mathing email
        if(!user) return res.status(403).json({success: false, message: "Invalid credentials"});
        //Bcrypt is used to crypt the given password and it is then compared to the hash that is found in the database.
        //If they match a jwt token is sent to the front end aka the user is who they claim to be.
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const jwtPayload = {
                    id: user._id,
                    email: user.email
                }
                jwt.sign(
                    jwtPayload,
                    process.env.SECRET,
                    // {expiresIn: '1h'}, //Token is set to expire in 1h. So the user will have to refresh it or they will have to login again. Source: https://www.npmjs.com/package/jsonwebtoken
                    (err, token) => {
                        if(err) throw err;
                        res.status(200).json({success: true, token: token});
                    }
                );
            }else{
                res.status(403).json({success: false, message: "Invalid credentials"});
            }
        });
    });
});


module.exports = router;