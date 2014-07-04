'use strict';

process.env.DBNAME = 'nodeTemplate-test';
var expect = require('chai').expect;
var User;
var SampleModel;
var u1;
var Mongo = require('mongodb');

describe('User', function(){
  this.timeout(10000);
  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      SampleModel = require('../../app/models/sampleModel');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({name:'Drew', email:'drew@nomail.com', password:'1234'});
      u1.register(function(err, body){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      var u2 = new User({email:'test@nomail.com', whatever:'some stuff', password: '1234'});
      expect(u2).to.be.instanceof(User);
      expect(u2.whatever).to.equal('some stuff');
      expect(u2.email).to.equal('test@nomail.com');
      expect(u2.password).to.equal('1234');
    });
  });

  describe('register', function(){
    it('should register a new user into the database', function(done){
      var u2 = new User({email:'test@nomail.com', whatever:'some stuff', password: '1234'});
      u2.register(function(err, body){
        expect(typeof err).to.not.equal('string');
        expect(u2.password).to.not.equal('1234');
        expect(u2.password).to.have.length('60');
        expect(u2._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
    it('should not register a new user if a duplicate email is found', function(done){
      var u2 = new User({email:'drew@nomail.com', name:'Bob', password: '1234'});
      u2.register(function(err, body){
        expect(typeof err).to.equal('string');
        done();
      });
    });
  });
  describe('findById', function(){
    it('should find a user by id', function(done){
      var u2 = new User({email:'nothing@nomail.com', whatever:'stuff', password: '1234'});
      u2.register(function(err, body){
        User.findById(u2._id.toString(), function(err, record){
          expect(typeof err).to.not.equal('string');
          expect(record.whatever).to.equal('stuff');
          done();
        });
      });
    });
  });
  describe('findByWhatever', function(){
    it('should find a user by whatever', function(done){
      var u2 = new User({email:'nothing@nomail.com', whatever:'stuff', password: '1234'});
      u2.register(function(err, body){
        User.findByWhatever(u2.whatever, function(err, record){
          expect(record.email).to.equal('nothing@nomail.com');
          done();
        });
      });
    });
  });
  describe('findByEmailAndPassword', function(){
    it('should find a user by email and password for login purposes', function(done){
      var u2 = new User({email:'nothing@nomail.com', whatever:'Bob', password: '1234'});
      u2.register(function(err, body){
        User.findByEmailAndPassword(u2.email, '1234', function(err, record){
          expect(record.email).to.equal('nothing@nomail.com');
          expect(record.password).to.equal(u2.password);
          expect(record._id).to.deep.equal(u2._id);
          done();
        });
      });
    });
    it('should not find a user by email and password', function(done){
      var u2 = new User({email:'nothing@nomail.com', whatever:'Bob', password: '1234'});
      u2.register(function(err, body){
        User.findByEmailAndPassword(u2.email, 'abcd', function(err, record){
          expect(typeof err).to.equal('string');
          done();
        });
      });
    });
  });
  describe('findByEmail', function(){
    it('should find a user by email.', function(done){
      var u2 = new User({email:'nothing@nomail.com', whatever:'Bob', password: '1234'});
      u2.register(function(err, body){
        User.findByEmail(u2.email, function(err, record){
          expect(record.email).to.equal('nothing@nomail.com');
          expect(record._id).to.deep.equal(u2._id);
          done();
        });
      });
    });
    it('should not find a user by email.', function(done){
      User.findByEmail('not there', function(err, record){
        expect(typeof err).to.equal('string');
        done();
      });
    });
  });
  describe('#update', function(){
    it('should update a users info in the database', function(done){
      var u2 = new User({email:'nothing@nomail.com', whatever:'Bob', password: '1234'});
      u2.register(function(err, body){
        u2.whatever = 'notBob';
        u2.update(function(err, record){
          expect(record.whatever).to.equal('notBob');
          done();
        });
      });
    });
  });
  describe('#addSampleModel', function(){
    it('should add a sample model id to the Users sample models array', function(done){
      var u2 = new User({email:'nothing@nomail.com', name:'Bob', password: '1234'});
      u2.register(function(err, body){
        var s1 = new SampleModel({whatever: 'stuff'});
        s1.insert(function(err, records){
          u2.addSampleModel(s1._id);
          u2.update(function(err, record){
            expect(record.sampleModels.length).to.equal(1);
            done();
          });
        });
      });
    });
  });
});
