'use strict';

var mongoose   = require('mongoose');
// Suppress Promise warnings. Even if we do not use promises, we get the warning
// see: https://github.com/Automattic/mongoose/issues/4951#issuecomment-283327958
mongoose.Promise = global.Promise;
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var utils =  require('../utils');
var app = require('../../app');
var seedDb = require('../seedDb');
var request = require('supertest');
var favs;

describe('Task 2: Testing Read and Delete for /favorites routes', function(){

  describe('GET /favorites', function(){

    before(seed);
    after(utils.dropDb);

    it('should list all the favs with correct data', function(done){
      request(app)
        .get('/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res){
          var resFavs = JSON.parse(res.text);
          favs.forEach(function(fav){
            utils.matchFavsInfo(resFavs, fav);
          });
          done();
        });
    });
  });

  describe('GET /favorites/:favoriteid', function(){

    before(seed);
    after(utils.dropDb);

    it('should get the favorite with correct data', function(done){
      request(app)
        .get('/favorites/' + favs[1]._id.toString())
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res){
          var resFavs = JSON.parse(res.text);
          utils.matchFavInfo(resFavs, favs[1]);
          done();
        });
    });

    it('should respond with a 404 if the favorite does not exist', function(done){
      request(app)
        .get('/favorites/' + ObjectId().toString())
        .set('Accept', 'application/json')
        .expect(404, done);
    });
  });

});

function seed(done){
  //seed the db
  seedDb.seed(function(err, seedData){
    if (err) return done(err);
    favs = seedData[0].data;

    done();
  });
}
