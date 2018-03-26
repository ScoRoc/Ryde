var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Trip = require('../models/trips');
var lowerCase = require('../middleware/toLowerCase');



// Post a ryde/trip | /ryde
router.post('/', (req, res, next) => {
  let reqBody = lowerCase(req.body)
  Trip.create(reqBody, function(err, ryde) {
    if (err) {
      console.log("GOT AN ERROR CREATING THE RYDE", err)
      res.send(err)
    } else {
      res.json({ryde})
    }
  })
})

// Load a ryde/trip | /ryde/:id/edit
router.get('/:id/edit', (req, res, next) => {

  Trip.find({ _id: req.params.id}, function(err, trip) {
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.send(trip);
    }
  })
})

// Submit ryde/trip edits | /ryde/:id
router.put('/:id', (req, res, next) => {
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
});

// Complete a ryde/trip | /ryde/compelte
router.put('/complete', (req,res,next) =>{
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

// Delete a ryde/trip | /ryde/delete
router.put('/delete', (req,res,next) =>{
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



module.exports = router;
