var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Trip = require('../models/trips');
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async')


// Request to join ryde | /myrydes
router.put('/', (req, res, next) => {
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

// Get logged in user's rydes | /myrydes/:id
router.get('/:id', (req, res, next) => {
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
          //console.log(user);
          trip.driver = user.toObject();
          callback(false, trip);
        });
      }, (err, trips) => res.send(trips));
    }
  })
})




module.exports = router;
