const request = require('supertest')
    , config = require('./config')
    , should = require('should')
    // expected jsons
    , expectedTuring = require('./expected-turing')
    , expectedSimple = require('./expected-simple');

const baseURL = config.baseURL;

describe('Exercise 7. JSON Tag Cloud ', function(){
  it('should work for simple ...', function(done){
    request(baseURL)
      .get('/cloud?file=simple.txt')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(expectedSimple, done)
  });

   it('and complex texts', function(done){
    request(baseURL)
      .get('/cloud?file=turing.txt')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(expectedTuring, done)
  });

  it('should still support regular requests', function(done){
    request(baseURL)
      .get('/cloud?file=turing.txt')
      .expect(200)
      .expect('Content-Type', /text\/html/, done)
  });
  
});
