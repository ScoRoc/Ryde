require('dotenv').config();
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Trip = require('../models/trips');
var bcrypt = require('bcrypt');
var async = require('async')
var ObjectId = require('mongoose').Types.ObjectId;

// Load Public Profile
router.get('/:id', (req, res, next) => {
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

// Submit Review For Other User /profile/:id/reviewuser
router.post('/:id/reviewuser', (req, res, next) => {
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

// Delete dryver details/status |  /profile/:id/removedryverstatus
router.put('/:id/removedryverstatus', (req, res, next) => {
  let { userId } = req.body;
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

// Submit dryver details/Becom a Dryver | /profile/:id/becomedryver
router.put('/:id/becomedryver', (req, res, next) => {
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

// Submit changes to private profile page | /profile/:id/edit
router.put('/:id/edit', (req, res, next) => {
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

// Delete Profile  | /profile/:id
router.delete('/:id', (req,res,next)=>{
  let {email, password, userId} = req.body
  let toDelete = {
    email
  }
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
        //console.log('removeuser: ',doc1);
        Trip.remove(userTrips).exec(function(err, doc2){
          //update trips where user is a denied,pending, and rider
          //console.log('removetrips :',doc2,current);
          Trip.update(
            tripRider,
            {$pull:{ridersId: userId}},
            {multi:true}
          ).exec(function(err, doc3){
            //console.log('removerider: ',doc3,current);
            Trip.update(
              tripPend,
              {$pull:{pendingRiders: userId}},
              {multi:true}
            ).exec(function(err, doc4){
              //console.log('removepend: ',doc4, current);
              Trip.update(
                tripDenied,
                {$pull:{deniedRiders: userId}},
                {multi:true}
              ).exec(function(err, doc5){
                //console.log('removedenied: ','hopefully user deleted totally');

                res.send({msg:true})
              })
            })
          })
        })
      })//end of if statement if bycrypt compare is true
    }
  })
})






module.exports = router;
