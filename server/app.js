var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config/database')
require('dotenv').config(); //Used to access the custom enviroment variable
const passport = require('passport');

//SECRET=LAKSJD!"#Lflkjds¨2å13kjlj


//const dataBaseConnection = process.env.MONGO_URL || 'mongodb://localhost:27017/week11';

//Database connection
mongoose.connect(config.database);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on('connected', () => {console.log('Connected to MongoDB')})
db.on("error", console.error.bind(console, "Mongo DB connection error"));

//Router
var apiRouter = require('./routes/api')

var app = express();

//For the passport. Source: https://stackoverflow.com/questions/60034257/typeerror-req-login-is-not-a-function-passport-js
app.use(passport.initialize());
require('./config/passport')(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', apiRouter);

//Logic to determine if the build is in production vs development. 
//Source for this is from our course's week 11 exercises
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production") {
    console.log('moi')
    app.use(express.static(path.resolve("..", "client", "build"))); //Telling the server where to find the front end files to serve
    app.get("*", (req, res) => {
        res.sendFile(path.resolve("..", "client", "build", "index.html")) //All other requests that are not for the server's router are sent to react that will handel them
    }
    );
}else if(process.env.NODE_ENV === "development"){
    //Required part to make CORS work on development
    var corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
}


module.exports = app;
