var express     = require('express');
var bodyParser  = require('body-parser');
var passport	= require('passport');
var mongoose    = require('mongoose');
var config      = require('./config/config');
var port        = process.env.PORT || 3000;
const cors = require('cors')

var app = express();

// get our request parameters
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use the passport package in our application
app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

// Demo Route (GET http://localhost:3000)
app.get('/', function(req, res) {
  return res.send('Hello! The API is at http://localhost:' + port + '/api');
});

var routes = require('./routes.js');
app.use('/api', routes);

mongoose.connect(config.db, { useNewUrlParser: true });

const connection = mongoose.connection;


connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});


// Start the server
app.listen(port);
console.log('Welcome : http://localhost:' + port);
