'use strict';

var User = require('../models/user');
var SampleModel = require('../models/sampleModel');
var Mongo = require('mongodb');

exports.index = function(req, res){
  SampleModel.index(function(sampleModels){
    User.findById(req.session.userId, function(err, user){
      res.render('sampleModels/index', {title: 'All Sample Models', sampleModels:sampleModels, user:user});
    });
  });
};

exports.createPage = function(req, res){
  if(req.session.userId){
    User.findById(req.session.userId, function(err, user){
      res.render('sampleModels/create', {title:'Add a New Sample Model', user:user});
    });
  } else {
    res.render('users/auth', {title:'Register/Login'});
  }
};

exports.create = function(req, res){
  var sampleModel =  {
    whatever: req.body.whatever || 'default setting'
  };
  var userIdString = req.session.userId.toString();
  var imageFile = req.body.imageFile || req.files.imageFile.path;
  User.findById(userIdString, function(userErr, user){
    if(typeof userErr === 'string'){
      res.render('sampleModels/create', {title:'Add a New Sample Model', err:userErr, user:user});
    } else {
      var s1 = new SampleModel(sampleModel);
      s1.addUser(user._id);
      s1.insert(function(modelErr, records){
        if(typeof modelErr === 'string'){
          res.render('sampleModels/create', {title:'Add a New Sample Model', err:modelErr, user:user});
        } else {
          var u1 = new User(user);
          u1._id = user._id;
          u1.addSampleModel(s1._id);
          s1.addImage(imageFile, function(err){
            u1.update(function(err, userRecord){
              s1.update(function(err, sampleModelRecord){
                res.redirect('sampleModels/' + s1._id.toString());
              });
            });
          });
        }
      });
    }
  });
};

exports.edit = function(req, res){
  SampleModel.findById(req.params.id, function(sampleModel){
    User.findById(req.session.userId, function(err, user){
      res.render('sampleModels/edit', {title:'Edit a Sample Model', sampleModel:sampleModel, user:user});
    });
  });
};

exports.update = function(req, res){
  var s1 = new SampleModel(req.body.sampleModel || req.body);
  var imageFile = req.body.imageFile || req.files.imageFile.path;
  s1._id = new Mongo.ObjectID(req.params.id);
  s1.addImage(imageFile, function(err){
    s1.update(function(record){
      res.redirect('/sampleModels/' + req.params.id);
    });
  });
};

exports.remove = function(req, res){
  SampleModel.destroy(req.params.id, function(err, count){
    res.redirect('/sampleModels');
  });
};

exports.show = function(req, res){
  User.findById(req.session.userId, function(err, user){
    SampleModel.findById(req.params.id, function(sampleModel){
      if(sampleModel){
        res.render('sampleModels/show', {title:'Sample Model Show', sampleModel:sampleModel, user:user});
      } else {
        res.render('sampleModels/', {title:'Sample Models', err:'sampleModel not found', user:user});
      }
    });
  });
};
