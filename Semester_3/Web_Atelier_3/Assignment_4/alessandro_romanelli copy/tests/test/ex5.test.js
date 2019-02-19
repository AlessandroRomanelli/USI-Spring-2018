const request = require('supertest')
    , config = require('./config')
    , should = require('should')
    // expected jsons
    , expectedTuring = require('./expected-turing')
    , expectedSimple = require('./expected-simple')
    , cheerio = require('cheerio');

const baseURL = config.baseURL;

describe('Exercise 5. File Statistics ', function(){
  it('should work for .txt ...', function(done){
    request(baseURL)
      .get('/stats?file=freq.txt')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .end(function(err, res){
        if(err) return done(err);

        const $ = cheerio.load(res.text);

        const frequency_table = $('table#frequency-tbl');
        frequency_table.length.should.equal(1);

        const words = frequency_table.find('td.word');
        const freqs = frequency_table.find('td.frequency');

        const solution = {
          "Hello"     : "1",
          "hello"     : "3",
          "my"        : "1",
          "name"      : "1",
          "is"        : "1",
          "masiar"    : "1",
          "I"         : "2",
          "am"        : "1",
          "26"        : "1",
          "years"     : "1",
          "old"       : "1",
          "and"       : "1",
          "listen"    : "1",
          "to"        : "1",
          "classical" : "1",
          "music"     : "1"
        }

        words.each(function(idx, word){
          const wordtext = $(word).text();
          const freqText = $(word).siblings( '.frequency' ).text();
          solution[wordtext].should.equal(freqText);
        });

        done();
      });
  });

   it('and .html files. ', function(done){
    request(baseURL)
      .get('/stats?file=freq.html')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .end(function(err, res){
        if(err) return done(err);

        const $ = cheerio.load(res.text);

        const frequency_table = $('table#frequency-tbl');
        frequency_table.length.should.equal(1);

        const words = frequency_table.find('td.word');
        const freqs = frequency_table.find('td.frequency');

        const solution = {
          "Hello"     : "1",
          "hello"     : "3",
          "my"        : "1",
          "name"      : "1",
          "is"        : "1",
          "masiar"    : "1",
          "I"         : "2",
          "am"        : "1",
          "26"        : "1",
          "years"     : "1",
          "old"       : "1",
          "and"       : "1",
          "listen"    : "1",
          "to"        : "1",
          "classical" : "1",
          "music"     : "1",
          "head"      : "2",
          "body"      : "2",
          "html"      : "2",
          "mytitle"   : "1"
        }

        words.each(function(idx, word){
          const wordtext = $(word).text();
          const freqText = $(word).siblings( '.frequency' ).text();
          solution[wordtext].should.equal(freqText);
        });

        done();
      });
  });

  it('should return 400 "Bad Request" for an mp3', function(done){
    request(baseURL)
      .get('/stats?file=four-seasons.mp3')
      .expect(400, done);
  });

  it('should return 400 "Bad Request" for a js script', function(done){
    request(baseURL)
      .get('/stats?file=foo.js')
      .expect(400, done);
  });

  it('should return 400 "Bad Request" for a CSS file', function(done){
    request(baseURL)
      .get('/stats?file=style.css')
      .expect(400, done);
  });
});
