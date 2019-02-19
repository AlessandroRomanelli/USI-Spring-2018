'use strict';

var config = require('../../config');
var should = require('should');
var seedDb = require('../seed');
var request = require('supertest');
var favs = require('../seedData')

describe('Task 6: Testing /bookmarked routes and /favorites/:favoriteid/bookmarked', function(){

  describe('GET /bookmarked', function(){
    it('should list only the bookmarked favs', function(done){
      request(config.url)
        .get('/bookmarked')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res){
          var resFavs = JSON.parse(res.text);
          resFavs.forEach(function(fav){
            should.equal(fav[config.form.bookmarked], "true");
          });
          done();
        });
    });
  });

  describe('PUT /favorites/:favoriteid/bookmarked', function(){
    it('initial bookmarked value should be false', function(done){
      request(config.url)
        .get(`/favorites/${favs[0]._id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res){
          var resFav = JSON.parse(res.text);
          should(resFav[config.form.bookmarked], "false")
          done();
        });
    });

    it('should change the bookmarked value', function(done){
      const reqBody = {}
      reqBody[config.form.bookmarked] = "true"

      request(config.url)
        .put(`/favorites/${favs[0]._id}/bookmarked`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(reqBody)
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res){
          var resFav = JSON.parse(res.text);
          should(resFav[config.form.bookmarked], "true")
          done();
        });
    });

    it('bookmarked value should be changed', function(done){
      request(config.url)
        .get(`/favorites/${favs[0]._id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res){
          var resFav = JSON.parse(res.text);
          should(resFav[config.form.bookmarked], "true")
          done();
        });
    });
  });
});
