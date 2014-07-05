'use strict';

var User = require('../models/user');

exports.index = function(req, res){
  User.findById(req.session.userId, function(err, user){
    res.render('home/index', {title: 'Node Template', user:user});
  });
};
