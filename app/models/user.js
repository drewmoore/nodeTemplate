'use strict';

var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
var email = require('../lib/send-email');
var Mongo = require('mongodb');
var User;

module.exports = User;

function User(user){
  this.email = user.email;
  this.password = user.password;
  this.whatever = user.whatever;
  this.name = user.name || '';
  this.sampleModels = [];
}

User.prototype.register = function(fn){
  var self = this;
  hashPassword(self.password, function(hashed){
    self.password = hashed;
    User.dupeCheckEmail(self.email, function(dupeResult){
      if(dupeResult.response){
        insert(self, function(err, inserted){
          email.sendWelcome({to:self.email, name:self.name}, function(err, body){
            fn(err, inserted);
          });
        });
      } else {
        fn('That email is already in here, yo!');
      }
    });
  });
};

function hashPassword(password, fn){
  bcrypt.hash(password, 8, function(err, hash){
    fn(hash);
  });
}

User.dupeCheckEmail = function(email, fn){
  users.findOne({email:email}, function(err, foundUser){
    if(foundUser === null){
      fn({response:true});
    } else {
      fn({response:false, failedOn:foundUser._id});
    }
  });
};

function insert(user, fn){
  users.insert(user, function(err, record){
    fn(err, record);
  });
}

User.findById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  users.findOne({_id:mongoId}, function(err, record){
    fn(err, record);
  });
};

User.findByWhatever = function(whatever, fn){
  users.findOne({whatever:whatever}, function(err, record){
    fn(err, record);
  });
};

User.findByEmailAndPassword = function(email, password, fn){
  users.findOne({email:email}, function(err, record){
    if(record){
      bcrypt.compare(password, record.password, function(err, result){
        if(result){
          fn(err, record);
        } else {
          fn('That password is wack, yo!');
        }
      });
    } else {
      fn('That email is wack, yo!');
    }
  });
};

User.findByEmail = function(email, fn){
  users.findOne({email:email}, function(err, record){
    if(record === null) {
      err = 'User with that email not found.';
    }
    fn(err, record);
  });
};

User.prototype.update = function(fn){
  var self = this;
  users.update({_id:self._id}, self, function(err, count){
    User.findById(self._id.toString(), function(err, record){
      fn(err, record);
    });
  });
};

User.prototype.addSampleModel = function(id){
  this.sampleModels.push(id);
};
