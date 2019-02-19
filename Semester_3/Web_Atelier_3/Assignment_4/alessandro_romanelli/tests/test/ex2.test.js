const request = require('supertest')
    , config = require('./config')
    , should = require('should')

const baseURL = config.baseURL;

describe('Exercise 2. MIME Type Headers', function(){
  it('should support text/html MIME type', function(done){
    request(baseURL)
      .get('/file/index.html')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support text/css MIME type', function(done){
    request(baseURL)
      .get('/file/style.css')
      .expect(200)
      .expect('Content-Type', /text\/css/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support text/plain MIME type', function(done){
    request(baseURL)
      .get('/file/hello.txt')
      .expect(200)
      .expect('Content-Type', /text\/plain/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support video/mp4 MIME type', function(done){
    request(baseURL)
      .get('/file/bunny.mp4')
      .expect(200)
      .expect('Content-Type', /video\/mp4/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support video/ogg MIME type', function(done){
    request(baseURL)
      .get('/file/bunny.ogv')
      .expect(200)
      .expect('Content-Type', /video\/ogg/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support image/gif MIME type', function(done){
    request(baseURL)
      .get('/file/afox.gif')
      .expect(200)
      .expect('Content-Type', /image\/gif/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support image/jpeg MIME type', function(done){
    request(baseURL)
      .get('/file/thing.jpg')
      .expect(200)
      .expect('Content-Type', /image\/jpeg/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support image/png MIME type', function(done){
    request(baseURL)
      .get('/file/asq.png')
      .expect(200)
      .expect('Content-Type', /image\/png/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support audio/mpeg MIME type', function(done){
    request(baseURL)
      .get('/file/four-seasons.mp3')
      .expect(200)
      .expect('Content-Type', /audio\/mpeg/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support application/javascript MIME type', function(done){
    request(baseURL)
      .get('/file/foo.js')
      .expect(200)
      .expect('Content-Type', /application\/javascript/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support application/json MIME type', function(done){
    request(baseURL)
      .get('/file/images.json')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support application/pdf MIME type', function(done){
    request(baseURL)
      .get('/file/ex-node.pdf')
      .expect(200)
      .expect('Content-Type', /application\/pdf/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support application/zip MIME type', function(done){
    request(baseURL)
      .get('/file/myfiles.zip')
      .expect(200)
      .expect('Content-Type', /application\/zip/)
      .end(function(err,res){
        if (err) return done(err);
        done();
      });
  });

  it('should support MIME types from nested files', function(done){
    let totalResponses =0;
    function responseReceived(err){
      if (err) return done(err);
      if(++totalResponses ==2){
        done();
      }
    }

    request(baseURL)
      .get('/file/level-1/level-2/foo-2.js')
      .expect('Content-Type', /application\/javascript/)
      .expect(200, responseReceived);
      
    request(baseURL)
      .get('/file/level-1/level-2/level-3/level-4/level-5/four-seasons.mp3')
      .expect('Content-Type', /audio\/mpeg/)
      .expect(200, responseReceived);
  });
  
});
