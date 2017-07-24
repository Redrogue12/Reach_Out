const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

mongoose.Promise = global.Promise

// USER SCHEMA
const userSchema = mongoose.Schema({

  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  contacts: []
})

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`.trim()
})

userSchema.methods.apiRepr = function () {
  return {
    username: this.username,
    name: this.fullName
  }
}

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = function (password) {
  console.log('anything')
  return bcrypt.hash(password, 10)
}

const User = mongoose.model('User', userSchema)

// EVENTS SCHEMA

const eventSchema = mongoose.Schema({
  name: String,
  location: String,
  date: Date,
  userId: String
})

eventSchema.methods.eventRepr = function () {
  return {
    name: this.name,
    location: this.location,
    date: this.date
  }
}

const Event = mongoose.model('Event', eventSchema)

module.exports = {Event, User}
