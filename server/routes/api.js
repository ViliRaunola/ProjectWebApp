var express = require('express');
var router = express.Router();
var User = require('../models/User')
var passwordValidator = require('password-validator');
var schema = new passwordValidator(); //Passport validation usage source: https://www.npmjs.com/package/password-validator
var bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator'); //Source on express validator: https://express-validator.github.io/docs/

//Giving requirements to the password
schema
    .is().min(10)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()

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
                            return  res.status(200).json({success: true});;
                        }
                    );
                });
            });
        }
    });
});


module.exports = router;