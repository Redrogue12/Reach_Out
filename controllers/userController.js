const mongoose = require('mongoose')
const {User} = require('../models')
const passport = require('passport')

exports.register = (req, res) => {
  console.log("registering a user")
  User
    .find({username: req.body.username})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        console.log('reject')
        return Promise.reject({
          name: 'AuthenticationError',
          message: 'user already registered'
        })
      }
      return User.hashPassword(req.body.password)
    })
    .then(hash => {
      return User
        .create({
          name: req.body.name,
          password: hash
        })
    })
    .then(user => {
      req.login(user, function (err) {
        console.log('register success')
        if (err) {return next(err)}
        req.session.username = req.user.username
        return res.redirect('/events')
      })
    })
    .catch(err => {
      if (err.name === 'AuthenticationError') {
        return res.status(422).json({message: err.message})
      }
      console.log(err)
      console.log(err.message)
      console.log(err.name)
      res.status(500).json({message: err.error})
    })
}

exports.logout = (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
}
