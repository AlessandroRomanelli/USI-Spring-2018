const request = require('supertest')
    , fs = require('fs')
    , path = require('path')
    , config = require('./config')
    , should = require('should');

const baseURL = config.baseURL;

describe('Exercise 6. JSON Tag Cloud ', function(){
  it('should work for simple ...', function(done){
    request(baseURL)
      .get('/cloud?file=simple.txt')
      .set('Accept', 'text/html')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .end(function(err, res){
        if(err) return done(err);

        const expectedCloud = fs.readFileSync(path.resolve(__dirname,'fixtures/expected_cloud-simple.txt'), 'utf8');
        const terms = expectedCloud.split(" ");

        terms.forEach(function(term){
            res.text.should.containEql(term);
        })

        done();
      });
  });

  it('should work for turing ...', function(done){
    request(baseURL)
      .get('/cloud?file=turing.txt')
      .set('Accept', 'text/html')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .end(function(err, res){
        if(err) return done(err);

        const expectedCloud = fs.readFileSync(path.resolve(__dirname,'fixtures/expected_cloud-turing.txt'), 'utf8');
        const terms = expectedCloud.split(" ");

        terms.forEach(function(term){
            res.text.should.containEql(term);
        })

        done();
    });
  });

  it('should return 400 "Bad Request" for an mp3', function(done){
    request(baseURL)
      .get('/cloud?file=four-seasons.mp3')
      .expect(400, done);
  });

  it('should return 400 "Bad Request" for a js script', function(done){
    request(baseURL)
      .get('/cloud?file=foo.js')
      .expect(400, done);
  });

  it('should return 400 "Bad Request" for a CSS file', function(done){
    request(baseURL)
      .get('/cloud?file=style.css')
      .expect(400, done);
  });

});
