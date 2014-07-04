'use strict';

var SampleModel;
var sampleModels = global.nss.db.collection('sampleModels');
var Mongo = require('mongodb');
var path = require('path');
var fs = require('fs');

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
SampleModel.prototype.addImage = function(oldname, fn){
  var self = this;
  var extension = path.extname(oldname);
  var sampleModelId = this._id.toString();
  var absolutePath = __dirname + '/../static';
  var sampleModelsPath = absolutePath + '/img/sampleModels';
  var relativePath = '/img/sampleModels/' + sampleModelId + extension;
  fs.mkdir(sampleModelsPath, function(){
    fs.rename(oldname, absolutePath + relativePath, function(err){
      self.image = relativePath;
      fn(err);
    });
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

SampleModel.destroy = function(id, fn){
  if((typeof id) === 'string'){
    id = Mongo.ObjectID(id);
  }
  sampleModels.remove({_id:id}, function(err, count){
    fn(err, count);
  });
};
