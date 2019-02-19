'use strict';

var mongoose   = require('mongoose');
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var utils =  require('../utils');
var app = require('../../app');
var seedDb = require('../seedDb');
var request = require('supertest');
var favorites;

describe('Task 6: Hypermedia', function(){

  before(seed);
  after(utils.dropDb);

  describe('GET /favorites', function(){
    it('should list correct links for all favorites', function(done){
      request(app)
        .get('/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res){
          var resObj = JSON.parse(res.text);
          resObj.forEach(function(fav){
            utils.checkLinksForFav(fav);
          });
          done();
        });
    });
  });

  describe('GET /favorites/:favid', function(){
    it('should list correct links for a favorite', function(done){
      request(app)
        .get('/favorites/' + favorites[1]._id.toString())
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res){
          var fav = JSON.parse(res.text);
          utils.checkLinksForFav(fav);
          done();
        });
    });
  });


  });

function seed(done){
  //seed the db
  seedDb.seed(function(err, seedData){
    if (err) return done(err);
    favorites = seedData[0].data;
    done();
  });
}
