require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var User = require('./models/user');
var Trip = require('./models/trips');
var lowerCase = require('./middleware/toLowerCase');
var ObjectId = require('mongoose').Types.ObjectId;
var bcrypt = require('bcrypt');


// Mongoose stuff
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/ryde');  // change db name here
mongoose.connect(process.env.MONGODB_URI);

// added a comment

// var index = require('./routes/index');
// var users = require('./routes/users');
var auth = require('./routes/auth');
var profile = require('./routes/profile');
var myrydes = require('./routes/myrydes');
var ryders = require('./routes/ryders');
var mydryves = require('./routes/mydryves');
var ryde = require('./routes/ryde');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(express.static(path.resolve(__dirname, 'client', 'build')));

// Do we still need this?
app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.currentUser = req.user;
  next();
});

app.get('/deletedb', (req, res) => {
  Users.remove({}, function() { console.log('deleted users....???') });
  Trips.remove({}, function() { console.log('deleted trips....???') });
})

app.post('/bigsearch', (req, res, next) => {
  let body = lowerCase(req.body)

  var searchOptions = {
    'startAddress.zip': body.zip,
    'startAddress.city': body.sCity,
    'endAddress.city': body.eCity,
    departDate: {$gte: body.dateTime},
    pets: body.pets,
    cost: {$lte: body.cost},
    reoccurring: body.reoccur,
    seats: {$gte: body.seat},
    completed: false,
    deleted:false
  }
  for (let key in searchOptions) {
    if (searchOptions[key] === '' || searchOptions[key] === false || searchOptions[key] === undefined) {
      delete searchOptions[key]
    }
  }
  if(searchOptions.cost['$lte']==='') delete searchOptions.cost
  if(searchOptions.seats['$gte']==='') delete searchOptions.seats
  //for some reason this key value pair was always being deleted I assume it had to do with a hidden js having to do with $ne
  if(body.userId) {
    searchOptions.driverId = {$ne:ObjectId(body.userId)}
    searchOptions.deniedRiders = {$ne: body.userId}
  }
  //console.log('searchoptions: ',searchOptions);

  Trip.find(searchOptions).lean().exec( function(err, trips) {
    let count = 0;
    let newTrips = []
    if(trips.length === 0) {
      return res.send({newTrips})
    } else {
      trips.forEach((trip,index)=>{
        //console.log('each trip time: ',trip.departDate);

        // console.log('trip date: ',(new Date(trip.departDate)).toUTCString());
        // console.log('search date: ',(new Date(req.body.dateTime)).toUTCString());

        let id = {'_id': ObjectId(trip.driverId)}
        let tripAvailability = (trip.seats - trip.ridersId.length - req.body.seat)
        //if no seats Available delete from index and count up
        //console.log('tripAvailability: ',tripAvailability);
        tripAvailability <= 0 ? (
          delete trips[index],
          count++,
          count === trips.length ? (
            res.send({newTrips})
          ) : (console.log(''))
        ) : (
          User.findOne(id, function(err, user) {
            trip.driver = user.toObject();
            count++;
            newTrips.push(trip);
            if(count === trips.length) {
              res.send({newTrips});
            }
          })
        )
      })
    }
  })
})

app.post('/minisearch', (req,res,next) =>{
  let bodh = req.body
  var searchOptions ={
    'startAddress.zip': bodh.startZip,
    'endAddress.zip': bodh.endZip,
    departDate: {$gte: bodh.date}
  }
  for(let key in searchOptions){
    if (searchOptions[key] === '' || searchOptions[key] === false) {
      delete searchOptions[key]
    }
  }
  if(bodh.userId){
    searchOptions.driverId = {$ne:ObjectId(bodh.userId)}
    searchOptions.deniedRiders = {$ne: bodh.userId}
  }
  //console.log(searchOptions);
  Trip.find(searchOptions).lean().exec( function(err, trips){
    let count = 0;
    let newTrips = []

    if(trips.length === 0) {
      return res.send([{newTrips}])
    } else {
      trips.forEach((trip,index)=>{

        // console.log('trip date: ',(new Date(trip.departDate)).toUTCString());
        // console.log('search date: ',(new Date(req.body.dateTime)).toUTCString());

        let id = {'_id': ObjectId(trip.driverId)}
        let tripAvailability = (trip.seats - trip.ridersId.length - req.body.seat)
        //if no seats Available delete from index and count up
        tripAvailability <= 0 ? (
          delete trips[index],
          count++,
          //if end of of foreach loop send trips otherwise next trip
          count === trips.length ? (
            res.send({newTrips})
          ) : (console.log('next trip loop'))
        ) : (
          User.findOne(id, function(err, user) {
            //add key value pair of driver to trip object
            trip.driver = user.toObject();
            count++;
            newTrips.push(trip);
            if(count === trips.length) {
              res.send({newTrips});
            }
          })
        )
      })
    }
  })
})


app.use('/auth', auth);
app.use('/profile', profile);
app.use('/myrydes', myrydes);
app.use('/ryders', ryders);
app.use('/mydryves', mydryves);
app.use('/ryde', ryde);

app.get('*', function(req, res, next) {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

module.exports = app;
