require('dotenv').config();
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Trips = require('../models/trips');
var bcrypt = require('bcrypt');
var request = require('request');


var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
  let hashedPass = ''
  let passwordMatch = false
  User.findOne({email: req.body.email.toLowerCase()}, function(err, user) {
    if (!user) {
      res.json({user: null, token: ''});
    } else {
      hashedPass = user.password
      console.log("This is the submitted pass:")
      console.log(req.body.password)
      console.log("This is the hashed pass:")
      console.log(hashedPass)
      passwordMatch = bcrypt.compareSync(req.body.password, hashedPass)
      if (passwordMatch) {
        console.log("Password is correct!")
        var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24 // expires in 24 hours
        })
        let profilePicUrl = 'https://www.avatarapi.com/js.aspx?email=' + user.email + '&size=200'
        request(profilePicUrl, function (error, response, body) {
          var profilePic = ''
          profilePic = body.split('>')
          profilePic = profilePic[1] + ' />'
          if (profilePic === 'undefined />') {
            User.findOneAndUpdate(
              {_id: user._id},
              {$set: {image: '<img src="http://www.everythingjustrocks.com/wp-content/uploads/default.png" width="200" height="200" />' }},
              {new: true}
            ).then(function(data) {
              res.json({user: data.toObject(), token})
            })
          } else {
            User.findOneAndUpdate(
              {_id: user._id},
              {$set: {image: profilePic }},
              {new: true}
            ).then(function(data) {
              res.json({user: data.toObject(), token})
            })
          }
        });
      } else {
        console.log("Passwords don't match")
        res.json({
          error: true,
          message: 'Email or password is incorrect'
        })
      }
    }
  })
})

router.post('/signup', (req, res, next) => {
  User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
    if (user) {
      res.redirect('/auth/signup')
    } else {
      User.create({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        dob: req.body.dob,
        'homeAddress.street': req.body.homeStreet,
        'homeAddress.city': req.body.homeCity,
        'homeAddress.state': req.body.homeState,
        'homeAddress.zip': req.body.homeZip,
        'workAddress.street': req.body.workStreet,
        'workAddress.city': req.body.workCity,
        'workAddress.state': req.body.workState,
        'workAddress.zip': req.body.workZip
      }, function(err, user) {
        if (err) {
          console.log("GOT AN ERROR CREATING THE USER")
          res.send(err)
        } else {
          console.log("JUST ABOUT TO SIGN THE TOKEN")
          var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24
          })
          let profilePicUrl = 'https://www.avatarapi.com/js.aspx?email=' + user.email + '&size=200'
          request(profilePicUrl, function (error, response, body) {
            var profilePic = ''
            profilePic = body.split('>')
            profilePic = profilePic[1] + ' />'
            if (profilePic === 'undefined />') {
              User.findOneAndUpdate(
                {_id: user._id},
                {$set: {image: '<img src="http://www.everythingjustrocks.com/wp-content/uploads/default.png" width="200" height="200" />' }},
                {new: true}
              ).then(function(data) {
                res.json({user: data.toObject(), token})
              })
            } else {
              User.findOneAndUpdate(
                {_id: user._id},
                {$set: {image: profilePic }},
                {new: true}
              ).then(function(data) {
                res.json({user: data.toObject(), token})
              })
            }
          });
        }
      })
    }
  })
})

router.post('/me/from/token', (req, res, next) => {
  var token = req.body.token
  if (!token) {
    res.status(401).json({message: "Must pass the token"})
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
      if (err) {
        res.status(401).send(err)
      } else {
        User.findById({
          '_id': user._id
        }, function(err, user) {
          if (err) {
            res.status(401).send(err)
          } else {
            res.json({user: user.toObject(), token})
          }
        })
      }
    })
  }
})

module.exports = router;
