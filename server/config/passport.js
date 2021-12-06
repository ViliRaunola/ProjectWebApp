const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

    //Source on passport-jwt usage: http://www.passportjs.org/packages/passport-jwt/

module.exports = (passport) => {
    const opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //Extracting token from bearer header
    opts.secretOrKey = process.env.SECRET;
    //Checks that the JWT is valid and was made from my secret
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) { 
        User.findById(jwt_payload.id, function(err, user) {  //"jwt_payload is an object literal containing the decoded JWT payload." So calling it I will get the user's Id that sent the request + jwt token
            if (err) {
                console.log('joku error')
                return done(err, false);
            }
            //If the user is found it is returned and can be accessed in 'req'-element in the function that called this one. Other wise false is returned
            if (user) {
                return done(null, user); 
            } else {
                
                return done(null, false);
            }
        });
    }));
}
