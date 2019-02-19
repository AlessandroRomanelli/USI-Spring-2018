'use strict';

var config = require('../../config');
var should = require('should');
var seedDb = require('../seed');
var request = require('supertest');
var favs = require('../seedData');

describe('Task 4: Testing Update on /favorites routes', function(){
  describe('PUT /favorites/:favoriteid', function(){
    it('should change the name of an existing favorite', function(done){
      let reqBody = {}
      reqBody[config.form.name] = 'newName'

      request(config.url)
        .put('/favorites/' + favs[3]._id)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(reqBody)
        .expect(201)
        .end(function(err, res){
          let resPutFav = JSON.parse(res.text)
          should(resPutFav[config.form.name], 'newName')
          done()
        });
    });
  })

  describe('GET /favorites/:favoriteid', function(){
    it('the name should be changed', function(done){
      request(config.url)
        .get('/favorites/' + favs[3]._id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json' )
        .expect(200)
        .end(function(err, res){
          var favGetFav = JSON.parse(res.text);
          should.equal(favGetFav[config.form.name], 'newName');
          done();
        });
    });
  });
});
