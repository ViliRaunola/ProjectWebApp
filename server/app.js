var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config/database')

//const dataBaseConnection = process.env.MONGO_URL || 'mongodb://localhost:27017/week11';

//Database connection
mongoose.connect(config.database);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on('connected', () => {console.log('Connected to MongoDB')})
db.on("error", console.error.bind(console, "Mongo DB connection error"));

//Router
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/api', apiRouter);

module.exports = app;
