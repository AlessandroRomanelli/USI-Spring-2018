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

describe('Task 5: Testing Delete for /favorites routes', function(){

  describe('DELETE /favorites/:favoriteid', function(){

    before(seed);
    after(utils.dropDb);

    it('should delete an existing favorite', function(done){
      request(app)
        .del('/favorites/' + favs[1]._id.toString())
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
      request(app)
        .del('/favorites/' + favs[1]._id.toString())
        .expect(200)
        .end(function(err, res){
        
        request(app)
          .get('/favorites')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/, 'it should respond with json' )
          .expect(200)
          .end(function(err, res){
            var resFavs = JSON.parse(res.text);
            resFavs.forEach(function(fav){
              should.notEqual(fav._id.toString(),favs[1]._id.toString());
           });
           done();
         });

      });
    });

    it('should respond with a 404 for a previously deleted resource', function(done){
      request(app)
        .delete('/favorites/' + favs[1]._id.toString())
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should respond with a 404 deleting a resource which does not exist', function(done){
      request(app)
        .delete('/favorites/' + ObjectId().toString())
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
