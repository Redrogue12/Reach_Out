const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const app = express()
const {PORT, DATABASE_URL} = require('./config')
const {User} = require('./models')
const userRouter = require('./routers/userRouter')
const eventRouter = require('./routers/eventRouter')
const userController = require('./controllers/userController')
mongoose.Promise = global.Promise

app.use(morgan('common'))
app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
  secret: 'some secret',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    url: DATABASE_URL,
    collection: 'sessions'
  })
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    console.log('Not on my watch')
    res.redirect('/')
  }
}
