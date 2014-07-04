'use strict';

var User = require('../models/user');
var SampleModel = require('../models/sampleModel');
var Mongo = require('mongodb');

exports.index = function(req, res){
  SampleModel.index(function(sampleModels){
    res.render('sampleModels/index', {title: 'All Sample Models', sampleModels:sampleModels});
  });
};

exports.createPage = function(req, res){
  res.render('sampleModels/create', {title:'Add a New Sample Model'});
};

exports.create = function(req, res){
  var sampleModel = req.body.sampleModel || {
    whatever: 'default setting'
  };
  var userIdString = req.session.userId.toString();
  var imageFile = req.body.imageFile || '';
  User.findById(userIdString, function(userErr, user){
    if(typeof userErr === 'string'){
      res.render('sampleModels/create', {title:'Add a New Sample Model', err:userErr});
    } else {
      var s1 = new SampleModel(sampleModel);
      s1.addUser(user._id);
      s1.insert(function(modelErr, records){
        if(typeof modelErr === 'string'){
          res.render('sampleModels/create', {title:'Add a New Sample Model', err:modelErr});
        } else {
          var u1 = new User(user);
          u1._id = user._id;
          u1.addSampleModel(s1._id);
          s1.addImage(imageFile, function(err){
            u1.update(function(err, userRecord){
              res.redirect('sampleModels/show/' + s1._id.toString());
            });
          });
        }
      });
    }
  });
};

exports.edit = function(req, res){
  SampleModel.findById(req.params.id, function(sampleModel){
    res.render('sampleModels/edit', {title:'Edit a Sample Model', sampleModel:sampleModel});
  });
};

exports.update = function(req, res){
  var s1 = new SampleModel(req.body);
  s1._id = new Mongo.ObjectID(req.params.id);
  s1.update(function(record){
    res.redirect('sampleModels/' + req.params.id);
  });
};

exports.remove = function(req, res){
  SampleModel.findById(req.params.id, function(sampleModel){
    var s1 = new SampleModel(sampleModel);
    s1.remove(function(){
      res.redirect('/sampleModels');
    });
  });
};

exports.show = function(req, res){
  SampleModel.findById(req.params.id, function(sampleModel){
    res.render('sampleModels/show', {title:'Sample Model Show', sampleModel:sampleModel});
  });
};
