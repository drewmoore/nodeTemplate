'use strict';

process.env.DBNAME = 'nodeTemplate-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var SampleModel;
var User;

describe('SampleModel', function(){
  this.timeout(10000);
  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      SampleModel = require('../../app/models/sampleModel');
      User = require('../../app/models/user');
      done();
    });
  });
  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      done();
    });
  });
  describe('new', function(){
    it('should create a new SampleModel object', function(done){
      var u1 = new User({email:'test@nomail.com', name:'sample', password:'1234'});
      u1.register(function(err, body){
        var s1 = new SampleModel({whatever: 'stuff'});
        s1.addUser(u1._id);
        expect(s1).to.be.instanceof(SampleModel);
        expect(s1.whatever).to.equal('stuff');
        expect(s1.userId).to.equal(u1._id.toString());
        done();
      });
    });
  });
  describe('insert', function(){
    it('should add a new SampleModel record to the database', function(done){
      var u1 = new User({email:'test@nomail.com', name:'Test', password:'1234'});
      u1.register(function(err, body){
        var s1 = new SampleModel({whatever: 'stuff', userId:u1._id});
        s1.insert(function(err, records){
          expect(s1._id).to.be.instanceof(Mongo.ObjectID);
          expect(records[0].whatever).to.equal(s1.whatever);
          done();
        });
      });
    });
  });
  describe('findById', function(){
    it('should find a SampleModel by its Id', function(done){
      var s1 = new SampleModel({whatever: 'stuff'});
      s1.insert(function(err, records){
        var id = (s1._id).toString();
        SampleModel.findById(id, function(record){
          expect(record._id).to.deep.equal(s1._id);
          done();
        });
      });
    });
  });
  describe('findByUserId', function(){
    it('should find a SampleModel by its userId', function(done){
      var u1 = new User({email:'test@nomail.com', name:'Test', password:'1234'});
      u1.register(function(err, body){
        var s1 = new SampleModel({whatever: 'stuff'});
        s1.addUser(u1._id);
        s1.insert(function(err, records){
          SampleModel.findByUserId(u1._id.toString(), function(results){
            expect(results.length).to.equal(1);
            expect(results[0].whatever).to.equal('stuff');
            done();
          });
        });
      });
    });
  });
  describe('index', function(){
    it('should find and return all sampleModels', function(done){
      var s1 = new SampleModel({whatever: 'stuff'});
      var s2 = new SampleModel({whatever: 'other stuff'});
      s1.insert(function(err, records){
        s2.insert(function(err, records2){
          SampleModel.index(function(records3){
            expect(records3.length).to.equal(2);
            done();
          });
        });
      });
    });
  });
  describe('#update', function(){
    it('should update a SampleModel info in the database', function(done){
      var s1 = new SampleModel({whatever: 'stuff'});
      s1.insert(function(err, records){
        s1.whatever = 'stuff changed';
        s1.update(function(result){
          var id = (s1._id).toString();
          SampleModel.findById(id, function(record){
            expect(record.whatever).to.deep.equal(s1.whatever);
            done();
          });
        });
      });
    });
  });
});
