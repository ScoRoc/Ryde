require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var User = require('./models/user');
var Trip = require('./models/trips');
var lowerCase = require('./middleware/toLowerCase');
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');
var bcrypt = require('bcrypt');


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

app.delete('/deleteuser', (req,res,next)=>{
  let {email, password, userId} = req.body
  let toDelete = {
    email
  }
  console.log(userId);
  let current = Date.now()
  let userTrips = {
    departDate: {$gte: current},
    driverId:ObjectId(userId)
  }
  let tripRider = {
    departDate: {$gte: current},
    ridersId: {$in:[userId]}
  }
  let tripPend = {
    departDate: {$gte: current},
    pendingRiders: {$in:[userId]}
  }
  let tripDenied = {
    departDate: {$gte: current},
    deniedRiders: {$in:[userId]}
  }
  // remove the user from User table
  User.findOne({email}, function(err, user){
    if(!(bcrypt.compareSync(password, user.password))){
      res.send({msg:false})
    }
    if(bcrypt.compareSync(password, user.password)){
      User.findOneAndRemove(toDelete, function(err, doc1){
        // remove the user's trips if he is a driver
        console.log('removeuser: ',doc1);
        Trip.remove(userTrips).exec(function(err, doc2){
          //update trips where user is a denied,pending, and rider
          console.log('removetrips :',doc2,current);
          Trip.update(
            tripRider,
            {$pull:{ridersId: userId}},
            {multi:true}
          ).exec(function(err, doc3){
            console.log('removerider: ',doc3,current);
            Trip.update(
              tripPend,
              {$pull:{pendingRiders: userId}},
              {multi:true}
            ).exec(function(err, doc4){
              console.log('removepend: ',doc4, current);
              Trip.update(
                tripDenied,
                {$pull:{deniedRiders: userId}},
                {multi:true}
              ).exec(function(err, doc5){
                console.log('removedenied: ','hopefully user deleted totally');

                res.send({msg:true})
              })
            })
          })
        })
      })//end of if statement if bycrypt compare is true
    }
  })
})


app.get('/finduser/:id', (req, res, next) => {
  User.findById({_id: req.params.id}, function(err, user) {
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
  console.log(body.reoccur);
  for (let key in searchOptions) {
    console.log('--------------');
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
  console.log('searchoptions: ',searchOptions);

  Trip.find(searchOptions).lean().exec( function(err, trips) {
    let count = 0;
    let newTrips = []
    if(trips.length === 0) {
      return res.send({newTrips})
    } else {
      trips.forEach((trip,index)=>{
        console.log('each trip time: ',trip.departDate);
        console.log('each trip time: ',new Date(trip.departDate).toUTCString());

        // console.log('trip date: ',(new Date(trip.departDate)).toUTCString());
        // console.log('search date: ',(new Date(req.body.dateTime)).toUTCString());

        let id = {'_id': ObjectId(trip.driverId)}
        let tripAvailability = (trip.seats - trip.ridersId.length - req.body.seat)
        //if no seats Available delete from index and count up
        console.log('tripAvailability: ',tripAvailability);
        tripAvailability <= 0 ? (
          delete trips[index],
          count++,
          count === trips.length ? (
            res.send({newTrips})
          ) : (console.log('looping'))
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

app.post('/complete', (req,res,next) =>{

  User.findOneAndUpdate(
    {_id: req.body.userId},
    {$push:{completedDryves: req.body.rydeId}},
    {new:true}
  ).exec( function(err, doc) {
    Trip.findByIdAndUpdate(
      {_id:req.body.rydeId},
      {$set:{completed:true}},
      {new:true}
    ).exec(function(err, doc){
      res.send(doc)
    })
  })
})

app.post('/delete', (req,res,next) =>{

  User.findOneAndUpdate(
    {_id: req.body.userId},
    {$push:{deletedDryves: req.body.rydeId}},
    {new:true}
  ).exec( function(err, doc) {
      Trip.findByIdAndUpdate(
        {_id:req.body.rydeId},
        {$set:{completed:true}},
        {new:true}
    ).exec(function(err, doc){
      res.send(doc)
    })
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
  console.log(searchOptions);
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

app.get('/mydryves/:id', (req, res, next) => {
  var searchOptions = {
    driverId: ObjectId(req.params.id),
    deleted:false
  }
  Trip.find(searchOptions).lean().exec( function(err, trips) {
    if(err){
      console.log(err);
      res.send(err);
    } else {
      async.map(trips, (trip, callback) => {
        User.findOne({ '_id': ObjectId(trip.driverId) }, function(err, user) {
          trip.driver = user.toObject();
          callback(false, trip);
        });
      }, (err, trips) => res.send(trips));
    }
  });
});

// This isn't fully RESTful. If we're editing a specific trip, the route should be POST /mydryves/:id
app.post('/mydryves', (req, res, next) => {
  console.log('Hit POST /mydryves route');
  let { userId, tripId, action } = req.body;
  Trip.findById(tripId, function (err, trip) {
    User.findById(userId, function (err, user) {
      let message = '';
      if(action === 'approve') {
        console.log(userId)
        trip.ridersId.push(userId);
        trip.pendingRiders.splice(trip.pendingRiders.indexOf(userId),1);
        user.setTrips.push(tripId);
        user.pendingTrips.splice(user.pendingTrips.indexOf(tripId),1);
        message = 'Approved the user!';
      } else if (action === 'reject') {
        console.log('Reject User from Trip Before:', trip.deniedRiders)
        if (!trip.deniedRiders.includes(userId)) {
          trip.deniedRiders.push(userId);
        }
        trip.pendingRiders.splice(trip.pendingRiders.indexOf(userId),1);
        trip.ridersId.splice(trip.ridersId.indexOf(userId),1);

        user.deniedTrips.push(tripId);
        user.pendingTrips.splice(user.pendingTrips.indexOf(tripId),1);
        user.completedTrips.splice(user.completedTrips.indexOf(tripId),1)
        console.log('reject user after: ', user.pendingTrips)
        message = 'Denied the user!';
      }
      trip.save(function (err, updatedTrip) {
        user.save(function (err, updatedUser) {
          res.send(message);
        });
      });
    });
  });
});

app.get('/myrydes/:id', (req, res, next) => {
  console.log('Hit GET /myrydes route');
  var searchOptions = [
    { pendingRiders: req.params.id },
    { ridersId: req.params.id }
  ];
  Trip.find({ $or: searchOptions }).lean().exec( function(err, trips) {
    if(err){
      console.log(err);
      res.send(err);
    } else {
      async.map(trips, (trip, callback) => {
        User.findOne({ '_id': ObjectId(trip.driverId) }, function(err, user) {
          console.log(user);
          trip.driver = user.toObject();
          callback(false, trip);
        });
      }, (err, trips) => res.send(trips));
    }
  })
})

//TODO refactor this to be more like POST /mydryves
app.post('/myrydes', (req, res, next) => {
  console.log('Hit POST /myrydes route');
  let { userId, tripId } = req.body;
  Trip.findById(tripId, function (err, trip) {
    User.findById(userId, function (err, user) {
      if(trip.driverId === ObjectId(userId)) {
        // THIS DOESN'T WORK YET
        res.send("You're the driver for this trip!");
      } else if(trip.deniedRiders.includes(userId)) {
        // User has already been denied for ride.
        res.send('Sorry! The driver has rejected your request.');
      } else if (trip.ridersId.includes(userId)) {
        // User has already been approved for ride, so they must want to remove it.
        trip.ridersId.splice(trip.ridersId.indexOf(userId),1);
        user.setTrips.splice(user.setTrips.indexOf(tripId),1);
        trip.save(function (err, updatedTrip) {
          user.save(function (err, updatedUser) {
            res.send('Removed user from approved riders');
          });
        });
      } else if(trip.pendingRiders.includes(userId)) {
        // User is already pending for ride, so they must want to remove it.
        trip.pendingRiders.splice(trip.pendingRiders.indexOf(userId),1);
        user.pendingTrips.splice(user.pendingTrips.indexOf(tripId),1);
        trip.save(function (err, updatedTrip) {
          user.save(function (err, updatedUser) {
            res.send('Removed user from pending riders');
          });
        });
      } else {
        trip.pendingRiders.push(userId);
        user.pendingTrips.push(tripId);
        trip.save(function (err, updatedTrip) {
          user.save(function (err, updatedUser) {
            res.send('Added user to pending riders');
          });
        });
      }
    });
  });
});

// Update User Info
app.post('/profile/:id/edit', (req, res, next) => {
  let {userId, name, email, dob, homeStreet, homeCity, homeState, homeZip, workStreet, workCity, workState, workZip} = req.body;
  User.findOneAndUpdate(
    {_id: userId},
    {$set: {
      name: name,
      email: email,
      dob: dob,
      homeAddress: {
        street: homeStreet,
        city: homeCity,
        state: homeState,
        zip: homeZip
      },
      workAddress: {
        street: workStreet,
        city: workCity,
        state: workState,
        zip: workZip
      }
    } },
    {new: true}
  ).lean().exec(
    function(err, doc) {
      if (err) {
        res.send('An error occurred', err);
      } else {
        // console.log('##########################', doc)
        res.send(doc)
      }
    }
  )
});

// Become Dryver
app.post('/profile/:id/becomedryver', (req, res, next) => {
  console.log('from front end', req.body)

  let {car, driversLicense, userId} = req.body;
  User.findOneAndUpdate(
    {_id: userId},
    {$set: {
      dryver: true,
      license: driversLicense,
      car
    } },
    {new: true}
  ).lean().exec(
    function(err, doc) {
      if (err) {
        res.send('An error occurred', err);
      } else {
        res.send(doc)
      }
    }
  )
});

// Remove Dryver status
app.post('/profile/:id/removedryverstatus', (req, res, next) => {
  let { userId } = req.body;
  console.log('hello');
  User.findOneAndUpdate(
    {_id: userId},
    {$set: {
      dryver: false,
      license: '',
      car: 'Not a Dryver'
    } },
    {new: true}
  ).lean().exec(
    function(err, doc) {
      if (err) {
        res.send('An error occurred', err);
      } else {
        res.send(doc)
      }
    }
  )
});

// Review User
app.post('/profile/:id/reviewuser', (req, res, next) => {
  let { clickedId, rating, userType, theUser } = req.body;
  let whichReviewed = (userType === 'ryder' ? 'Ryders' : 'Dryvers')
  let updateRatingsArray = function(cb) {
    User.findOneAndUpdate(
      {_id: clickedId},
      {$push: {[userType + 'Ratings']: rating} },
      {new: true}
    ).lean().exec( // .lean() returns a javascript object, not a mongo object; .exec() executes the callback
      function(err, doc) {
        // console.log(doc);
        if (err) { console.log('An error occurred in the first async function', err) }
        else {
          console.log('finished first');
          cb(null, doc);
        }
      }
    )
  };
  let updateRatingAvg = function(doc, cb) {
    User.findOneAndUpdate(
      {_id: clickedId},
      {$set: {
        [userType + 'RatingAvg']: (doc[userType + 'Ratings']
          .reduce((acc, curVal) => acc + curVal) / doc[userType + 'Ratings'].length).toFixed(2)
        }
      }, {new: true}
    ).lean().exec(
      function(err, doc) {
        if (err) { console.log('An error occurred in the second async function', err) }
        else {
          console.log('finished 2nd');
          cb(null, doc);
        }
      }
    )
  };
  let updateReviewedArray = function(doc, cb) {
    User.findOneAndUpdate(
        {_id: theUser._id},
        {$push: {['reviewed' + whichReviewed]: clickedId} },
        {new: true}
    ).lean().exec(
      function(err, doc2) {
        if (err) { console.log('An error occurred in the third async function', err) }
        else {
          console.log('finished 3rd');
          var users = {clickedUser: doc, theUser: doc2}
          cb(null, users);
        }
      }
    )
  };

  async.waterfall([updateRatingsArray, updateRatingAvg, updateReviewedArray], function(err, results) {
    if (err) {
      res.send('An error occurred updating the post /profile/:id/reviewuser route', err)
    } else {
      res.send(results);
    }
  });
});

app.post('/postARyde', (req, res, next) => {
  let reqBody = lowerCase(req.body)
  console.log('Hit POST /postARyde route');

  Trip.create(reqBody, function(err, ryde) {
    if (err) {
      console.log("GOT AN ERROR CREATING THE RYDE", err)
      res.send(err)
    } else {
      res.json({ryde})
    }
  })
})

app.get('/editARyde/:id', (req, res, next) => {
  console.log('Hit GET /myrydes route');
  Trip.find({ _id: req.params.id}, function(err, trip) {
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.send(trip);
    }
  })
})

app.post('/editARyde/:id', (req, res, next) => {
  console.log('Hit GET /editARyde/:id route');
  Trip.findById(req.params.id, function(err, trip) {
    if(err){

      res.send(err);
    } else {
      Object.assign(trip, req.body);
      trip.save(function (err, updatedTrip) {
        res.send(updatedTrip);
      });
    }
  })
})

app.post('/ryders/pending', (req, res, next) => {
  console.log('Hit POST /ryders Route')
  User.find({ _id: req.body.pending },
  ).lean().exec( function(err, user) {
    if (err) {
      console.log(err)
    } else {
      res.send(user)
    }
  })
})

app.post('/ryders/confirmed', (req, res, next) => {
  console.log('Hit POST /ryders Route')
  User.find({ _id: req.body.confirmed }
  ).lean().exec(function(err, user) {
      if (err) {
        console.log(err)
      } else {
        res.send(user)
      }
    }
  )
})

app.use('/auth', auth);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

module.exports = app;
