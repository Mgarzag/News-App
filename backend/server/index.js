require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const customAuthMiddleware = require('./middleware/custom-auth-middleware');
const session = require('express-session');

// Imports the account route created in user-controller
var AccountRoutes = require('./controllers/user-controller');

// Requiring our models for syncing
const db = require('./models/index');

// directory references
const clientDir = path.join(__dirname, '../client');

// set up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// Express middleware that allows POSTing data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure express
app.set('view engine','js');

// use the cookie-parser to help with auth token,
// it must come before the customAuthMiddleware
app.use(cookieParser());
app.use(customAuthMiddleware);

// serve up the public folder so we can request static
// assets from the client
app.use(express.static(`${clientDir}/public`));

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

// Include our routes created in user-controller.js
app.use('/',AccountRoutes.AccountRoutes);

// sync our sequelize models and then start server
// force: true will wipe our database on each server restart
// this is ideal while we change the models around
db.sequelize.sync().then(() => {
  
  
    // inside our db sync callback, we start the server
    // this is our way of making sure the server is not listening 
    // to requests if we have not made a db connection
    app.listen(PORT, () => {
      console.log(`App listening on PORT ${PORT}`);
    });
  });

