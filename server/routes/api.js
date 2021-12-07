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
                    userId: req.body.creator,
                    postId: req.body.postId,
                    content: req.body.content
                },
                (err, createdComment) => {
                    if(err) throw err;
                    //Adding the comment id to user document that created it
                    User.findOneAndUpdate({'_id': req.body.creator},
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
            creator: req.body.creator
        },
        (err, createdPost) => {
            if(err) throw err;
            //Adding the post Id to the user document.
            User.findOneAndUpdate({'_id': req.body.creator},
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
        return res.status(400).json( { errors: [errors.array(), errors_password], password: 'Password is not strong enough' } );
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