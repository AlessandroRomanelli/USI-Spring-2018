'use strict';

var config = require('../../config');
var should = require('should');
var seedDb = require('../seed');
var request = require('supertest');
var favs = require('../seedData')

describe('Task 5: Testing Delete for /favorites routes', function(){
  describe('DELETE /favorites/:favoriteid', function(){
    it('should delete an existing favorite', function(done){
      request(config.url)
        .del('/favorites/' + favs[1]._id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(204)
        .end(function(err, res){
          res.text.should.be.empty;
          res.body.should.be.empty;
          done();
        });
    });

    it('should not list the previously deleted resource', function(done){
      request(config.url)
        .del('/favorites/' + favs[2]._id)
        .expect(200)
        .end(function(err, res){

          request(config.url)
            .get('/favorites')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/, 'it should respond with json' )
            .expect(200)
            .end(function(err, res){
              var resFavs = JSON.parse(res.text);
              resFavs.forEach(function(fav){
                should.notEqual(fav[config.form._id], favs[2]._id);
             });
             done();
           });
         });
     });

    it('should respond with a 404 for a previously deleted resource', function(done){
      request(config.url)
        .delete('/favorites/' + favs[1]._id)
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should respond with a 404 deleting a resource which does not exist', function(done){
      request(config.url)
        .delete('/favorites/invalidId')
        .set('Accept', 'application/json')
        .expect(404, done);
    });
  });

});
