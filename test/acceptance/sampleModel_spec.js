'use strict';

process.env.DBNAME = 'nodeTemplate-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var SampleModel;
var User;
var u1;
var cookie;

describe('sampleModel', function(){
  this.timeout(10000);
  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      SampleModel = require('../../app/models/sampleModel');
      User = require('../../app/models/user');
      done();
    });
  });
  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({email:'sampleModelacceptance@nomail.com', name:'sampleModel Accept guy', password:'1234'});
      u1.register(function(err, inserted){
        request(app)
        .post('/login')
        .field('email', 'sampleModelacceptance@nomail.com')
        .field('password', '1234')
        .end(function(err, res){
          cookie = res.headers['set-cookie'];
          var sampleModel = {
            whatever: 'whatever'
          };
          var imageFile = __dirname + '/../fixtures/test-copy.jpg';
          request(app)
          .post('/sampleModel/create')
          .set('cookie', cookie)
          .send({sampleModel:sampleModel, imageFile:imageFile})
          .end(function(err, res){
            done();
          });
        });
      });
    });
  });
  describe('create sampleModel', function(){
    it('should create a new SampleModel object, add to DB', function(done){
      var sampleModel = {
        whatever: 'whatever'
      };
      var imageFile = __dirname + '/../fixtures/test-copy.jpg';
      request(app)
      .post('/sampleModels/create')
      .set('cookie', cookie)
      .send({sampleModel:sampleModel, imageFile:imageFile})
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

});
