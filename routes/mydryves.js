var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Trip = require('../models/trips');
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async')


// This isn't fully RESTful. If we're editing a specific trip, the route should be POST /mydryves/:id
// Approve/Deny ryders for a dryve | /mydryves
router.post('/', (req, res, next) => {

  let { userId, tripId, action } = req.body;
  Trip.findById(tripId, function (err, trip) {
    User.findById(userId, function (err, user) {
      let message = '';
      if(action === 'approve') {
        trip.ridersId.push(userId);
        trip.pendingRiders.splice(trip.pendingRiders.indexOf(userId),1);
        user.setTrips.push(tripId);
        user.pendingTrips.splice(user.pendingTrips.indexOf(tripId),1);
        message = 'Approved the user!';
      } else if (action === 'reject') {
        if (!trip.deniedRiders.includes(userId)) {
          trip.deniedRiders.push(userId);
        }
        trip.pendingRiders.splice(trip.pendingRiders.indexOf(userId),1);
        trip.ridersId.splice(trip.ridersId.indexOf(userId),1);
        user.deniedTrips.push(tripId);
        user.pendingTrips.splice(user.pendingTrips.indexOf(tripId),1);
        user.completedTrips.splice(user.completedTrips.indexOf(tripId),1)

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


// Get logged in user's dryves | /mydryves/:id
router.get('/:id', (req, res, next) => {
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




module.exports = router;
