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
var favorites;

describe('Task 3: Testing Create and Update on /favorites routes', function(){

  describe('POST /favorites', function(){

    before(seed);
    after(utils.dropDb);

    it('should create a new favorite if the request data is valid', function(done){

      var newFavData =  {
        "title"         : "Such a nice picture",
        "dataUrl"      : "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMDAgMjAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBkPSJNMTgwLDQxLjdoLTUxLjFWMzEuMWg0Mi4yQzE1My4xLDEyLjUsMTI3LjgsMSw5OS45LDFDNDUuMiwxLjEsMC45LDQ1LjQsMSwxMDAuMWMwLDI2LjgsMTAuNyw1MS4xLDI4LjEsNjguOQ0KCQljLTEuNC0yLTIuNC00LjEtMy02LjFjLTEtMy41LTEtNS45LTEuMS0xNS44di00Ny4xaDE0Ljh2NDguNWMwLDMuNC0wLjEsNi42LDEsOS42YzMsNy42LDExLjMsOC41LDE2LDguNWMyLjMsMCw4LjMtMC4xLDEyLjYtMy45DQoJCWM0LjQtMy45LDQuNC04LjQsNC40LTE1di00Ny43aDE0Ljl2NDkuN2MtMC4xLDguOS0wLjEsMTYuMy04LjUsMjMuNWMtOCw3LTE4LjQsNy43LTIzLjgsNy43Yy00LjgsMC05LjUtMC42LTE0LTIuMQ0KCQljLTEuOC0wLjYtMy41LTEuNC01LTIuM2MxNy4xLDE0LDM5LDIyLjQsNjIuOCwyMi40YzU0LjctMC4xLDk5LTQ0LjQsOTguOS05OS4xQzE5OSw3OC4xLDE5MS45LDU4LDE4MCw0MS43eiBNMTc1LjMsOTQuNGwtNi4zLTkNCgkJYzIuMS0xLjQsOC43LTUuNyw4LjctMTcuN2MwLTItMC4yLTQuMS0xLTYuMmMtMS43LTQuMS00LjYtNC45LTYuNi00LjljLTMuNiwwLTQuOSwyLjUtNS43LDQuM2MtMC41LDEuMy0wLjYsMS41LTEuOCw2LjZsLTEuNSw2LjkNCgkJYy0wLjksMy42LTEuMyw1LjQtMiw3LjJjLTEuMSwyLjYtNC41LDkuNi0xNCw5LjZjLTEwLjksMC0xNy44LTkuMi0xNy44LTIyLjZjMC0xMi4zLDYuMS0xOSwxMS42LTIzbDYuNiw4LjgNCgkJYy0yLjgsMS45LTguNSw1LjctOC41LDE0LjhjMCw1LjgsMi42LDEwLjgsNywxMC44YzQuOSwwLDUuOC01LjMsNi44LTEwLjVsMS4zLTUuOWMxLjYtNy43LDQuOC0xOC42LDE3LTE4LjYNCgkJYzEzLjEsMCwxOC40LDEyLjIsMTguNCwyNC4zYzAsMy4yLTAuMyw2LjctMS4zLDEwLjJDMTg1LjEsODMuNCwxODIuMyw5MC4xLDE3NS4zLDk0LjR6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==",
        "dateReleased" : "Mon Apr 11 1988 00:00:00 GMT+0100 (CET)",
        "bookmarked"   : "true"
      };

      request(app)
        .post('/favorites')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(newFavData)
        .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json' )
        .expect(201)
        .end(function(err, res){
          utils.matchFavInfo(JSON.parse(res.text), newFavData);
          done();
        });
    });

    it('should get a 400 Bad Request if data is invalid #1', function(done){
      var newFavData =  {
        "invalid"       : "this object does not have the correct structure",
      };

      request(app)
        .post('/favorites')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(newFavData)
        .expect(400, done);
    });

    it('should get a 400 Bad Request if data is not in json', function(done){
      request(app)
        .post('/favorites')
        .set('Content-Type', 'text/plain')
        .set('Accept', 'application/json')
        .send("This is a plain text request, it should result in a 400 bad request")
        .expect(400, done);
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
