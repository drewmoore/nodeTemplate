'use strict';

var User = require('../models/user');
var self = this;

exports.auth = function(req, res){
  User.findById(req.session.userId, function(err, user){
    res.render('users/auth', {title: 'Registration/Login', user:user});
  });
};

exports.register = function(req, res){
  var user = new User(req.body);
  user.register(function(err, inserted){
    if(inserted){
      self.login(req, res);
    } else {
      res.render('users/auth', {title:'Registration/Login', err: err});
    }
  });
  // Or just use the code below to turn off user registration. Prevent curl attacks.
  //res.render('/', title: 'Nice Try');
};

exports.login = function(req, res){
  User.findByEmailAndPassword(req.body.email, req.body.password, function(err, user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id.toString();
        req.session.save(function(){
          res.redirect('/');
        });
      });
    } else {
      req.session.destroy(function(){
        res.render('users/auth', {title: 'Registration/Login', err: err});
      });
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};
