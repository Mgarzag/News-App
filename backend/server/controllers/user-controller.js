var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var models = require('../models');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const router = express.Router();

// grab the User model from the models folder, the sequelize
// index.js file takes care of the exporting for us and the 
// syntaxt below is called destructuring, its an es6 feature
const { User } = require("../models");

/* Register Route
========================================================= */
router.post('/register', async (req, res) => {
  var matched_users_promise = models.User.findAll({
    where:  Sequelize.or(
            {username: req.body.username},
            {email: req.body.email}
        )
});
matched_users_promise.then(function(users){ 
  if(users.length == 0){
      const passwordHash = bcrypt.hashSync(req.body.password,10);
      models.User.create({
          username: req.body.username,
          email: req.body.email,
          password: passwordHash
      }).then(function(){
          let newSession = req.session;
          newSession.email = req.body.email;
          res.redirect('/');
      });
  }
  else{
      res.render('account/register',{errors: "Username or Email already in user"});
  }
});

    // hash the password provided by the user with bcrypt so that
    // we are never storing plain text passwords. This is crucial
    // for keeping your db clean of sensitive data
    const hash = bcrypt.hashSync(req.body.password, 10);
  
    try {
      // create a new user with the password hash from bcrypt
      let user = await User.create(
        Object.assign(req.body, { password: hash })
      );
  
      // data will be an object with the user and it's authToken
      let data = await user.authorize();
  
      // send back the new user and auth token to the
      // client { user, authToken }
      return res.json(data);
  
    } catch(err) {
      return res.status(400).send(err);
    }
  
  });
  
  /* Login Route
  ========================================================= */
  router.post('/login', async (req, res) => {
    var matched_users_promise = models.user.findAll({
      where: Sequelize.and(
          {email: req.body.email},
      )
  });
  matched_users_promise.then(function(users){ 
    if(users.length > 0){
        let user = users[0];
        let passwordHash = user.password;
        if(bcrypt.compareSync(req.body.password,passwordHash)){
            req.session.email = req.body.email;
            res.redirect('/');
        }
        else{
            res.redirect('/register');
        }
    }
    else{
        res.redirect('/login');
    }
});
    const { username, password } = req.body;
  
    // if the username / password is missing, we use status code 400
    // indicating a bad request was made and send back a message
    if (!username || !password) {
      return res.status(400).send(
        'Request missing username or password param'
      );
    }
  
    try {
      let user = await User.authenticate(username, password)
  
      user = await user.authorize();
  
      return res.json(user);
  
    } catch (err) {
      return res.status(400).send('invalid username or password');
    }
  
  });
  
  /* Logout Route
  ========================================================= */
  router.delete('/logout', async (req, res) => {
  
    // because the logout request needs to be send with
    // authorization we should have access to the user
    // on the req object, so we will try to find it and
    // call the model method logout
    const { user, cookies: { auth_token: authToken } } = req
  
    // we only want to attempt a logout if the user is
    // present in the req object, meaning it already
    // passed the authentication middleware. There is no reason
    // the authToken should be missing at this point, check anyway
    if (user && authToken) {
      await req.user.logout(authToken);
      return res.status(204).send()
    }
  
    // if the user missing, the user is not logged in, hence we
    // use status code 400 indicating a bad request was made
    // and send back a message
    return res.status(400).send(
      { errors: [{ message: 'not authenticated' }] }
    );
  });
  
  /* Me Route - get the currently logged in user
  ========================================================= */
  router.get('/me', (req, res) => {
    if (req.user) {
      return res.send(req.user);
    }
    res.status(404).send(
      { errors: [{ message: 'missing auth token' }] }
    );
  });
  
  // export the router so we can pass the routes to our server
  module.exports = {"AccountRoutes" : router};