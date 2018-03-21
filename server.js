require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var User = require('./models/user');
var Trip = require('./models/trips');
var lowerCase = require('./middleware/toLowerCase')


// Mongoose stuff
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ryde');  // change db name here

// var index = require('./routes/index');
// var users = require('./routes/users');
var auth = require('./routes/auth');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Do we still need this?
app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.currentUser = req.user;
  next();
});


app.get('/finduser/:id', (req, res, next) => {
  User.findOne({_id: req.params.id}, function(err, user) {
    if (user) {
      res.json(user.toObject())
    } else {
      res.status(420).json({
        error: true,
        message: 'Cant find user id'
      })
    }
  })
})

app.post('/bigsearch', (req, res, next) =>{
  let body = lowerCase(req.body)

  var searchOptions = {
    'startAddress.zip': body.zip,
    'startAddress.city': body.sCity,
    'endAddress.city': body.eCity,
    departDate: body.sTime,
    pets: body.pets,
    cost: body.cost,
    reoccurring: body.reoccur,
    seats: body.seat
  }

  for (let key in searchOptions) {
    if (searchOptions[key] === '' || searchOptions[key] === false) {
      delete searchOptions[key]
    }
  }

  Trip.find(searchOptions, function(err, trips){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      console.log(trips);
      res.send(trips);
    }
  })
})

app.post('/minisearch', (req,res,next) =>{
  let bodh = req.body
  var miniSearchObj ={
    'startAddress.zip': bodh.startZip,
    'endAddress.zip': bodh.endZip,
    departDate: bodh.date
  }
  for(let key in miniSearchObj){
    if (miniSearchObj[key] === '' || miniSearchObj[key] === false) {
      delete miniSearchObj[key]
    }
  }
  console.log(miniSearchObj);
  Trip.find(miniSearchObj, function(err, trips){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      console.log(trips);
      res.send(trips);
    }
  })
})

app.get('/mydryves/:id', (req, res, next) => {

  var searchOptions = {
    driverId: req.params.id
  }

  Trip.find(searchOptions, function(err, trips) {
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.send(trips);
    }
  })
})

app.get('/myrydes/:id', (req, res, next) => {
  console.log('Hit GET /myrydes route');
  var searchOptions = {
    ridersId: req.params.id
  }
  console.log(req.params.id)
  Trip.find(searchOptions, function(err, trips) {
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.send(trips);
    }
  })
})

app.post('/myrydes', (req, res, next) => {
  console.log('Hit POST /myrydes route');
  res.send('Ya did it, kid.');
  // TODO: Add real code to add/remove a ryde for a user
})

app.post('/postARyde', (req, res, next) => {
  let reqBody = lowerCase(req.body)
  console.log('Hit POST /postARyde route');
  console.log(reqBody)
  Trip.create(reqBody, function(err, ryde) {
    if (err) {
      console.log("GOT AN ERROR CREATING THE RYDE", err)
    } else {
      res.json({ryde})
    }
  })
})

app.use('/auth', auth);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

module.exports = app;
