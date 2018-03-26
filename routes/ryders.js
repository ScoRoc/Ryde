var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Trip = require('../models/trips');


// Load Confirmed ryders for a dryve. | /ryders/confirmed
router.post('/confirmed', (req, res, next) => {
  User.find({ _id: req.body.confirmed }
  ).lean().exec(function(err, user) {
      if (err) {
        console.log(err)
      } else {
        res.send(user)
      }
    }
  )
});


// Load pending ryders for dryve | /ryders/pending
router.post('/pending', (req, res, next) => {
  User.find({ _id: req.body.pending },
  ).lean().exec( function(err, user) {
    if (err) {
      console.log(err)
    } else {
      res.send(user)
    }
  })
});





module.exports = router;
