'use strict';

var SampleModel;
var sampleModels = global.nss.db.collection('sampleModels');
var Mongo = require('mongodb');

module.exports = SampleModel;

function SampleModel(sampleModel){
  this.whatever = sampleModel.whatever;
  this.userId = '';
}

SampleModel.index = function(fn){
  sampleModels.find().toArray(function(err, records){
    fn(records);
  });
};

SampleModel.prototype.addUser = function(userId){
  var self = this;
  self.userId = userId.toString();
};

SampleModel.prototype.insert = function(fn){
  var self = this;
  sampleModels.find({_id:self._id}).toArray(function(err, foundEntries){
    if(foundEntries.length === 0){
      sampleModels.insert(self, function(err, records){
        fn(err, records);
      });
    } else {
      fn('That sampleModel is already in here, yo!');
    }
  });
};

SampleModel.findById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  sampleModels.findOne({_id:mongoId}, function(err, record){
    fn(record);
  });
};

SampleModel.findByUserId = function(id, fn){
  sampleModels.find({userId:id.toString()}).toArray(function(err, records){
    fn(records);
  });
};

SampleModel.prototype.update = function(fn){
  var self = this;
  sampleModels.update({_id:self._id}, self, function(err, count){
    SampleModel.findById(self._id.toString(), function(record){
      fn(record);
    });
  });
};

SampleModel.prototype.remove = function(fn){
  var self = this;
  sampleModels.remove({_id:self._id}, function(){
    fn();
  });
};
