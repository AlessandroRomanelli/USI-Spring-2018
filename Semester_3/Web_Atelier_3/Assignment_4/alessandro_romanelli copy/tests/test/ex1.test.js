const request = require('supertest');


const should = require('should');
const config = require('./config');


const baseURL = config.baseURL;

describe('Exercise 1. Static file Server', () => {
  it('should download root file', (done) => {
    request(baseURL)
      .get('/file/hello.txt')
      .expect(200)
      .expect('Content-Disposition', /attachment;.*filename=('hello\.txt'|"hello\.txt")/)
      .end((err, res) => {
        if (err) return done(err);
        res.text.should.equal('Hello Express.js');
        done();
      });
  });

  it('should download level-1 file', (done) => {
    request.agent(baseURL)
      .get('/file/level-1/hello.txt')
      .expect(200)
      .expect('Content-Disposition', /attachment;.*filename=('hello\.txt'|"hello\.txt")/)
      .end((err, res) => {
        if (err) return done(err);
        res.text.should.equal('Hello from level 1!');
        done();
      });
  });

  it('should download level-2 file', (done) => {
    request(baseURL)
      .get('/file/level-1/level-2/foo-2.js')
      .expect(200)
      .expect('Content-Disposition', /attachment;.*filename=('foo-2\.js'|"foo-2\.js")/)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should download level-7 file', (done) => {
    request.agent(baseURL)
      .get('/file/level-1/level-2/level-3/level-4/level-5/level-6/level-7/level7.txt')
      .expect(200)
      .expect('Content-Disposition', /attachment;.*filename=('level7\.txt'|"level7\.txt")/)
      .end((err, res) => {
        if (err) return done(err);
        res.text.should.equal('You made it to level 7!');
        done();
      });
  });

  it('should handle white space characters', (done) => {
    request.agent(baseURL)
      .get('/file/hello world node.txt')
      .expect(200)
      .expect('Content-Disposition', /attachment;.*filename=('hello world node\.txt'|"hello world node\.txt")/)
      .end((err, res) => {
        if (err) return done(err);
        res.text.should.equal('I have spaces in my file name');
        done();
      });
  });

  it('should handle lowercase and uppercase', (done) => {
    request.agent(baseURL)
      .get('/file/UppeRCaSeLowerCASE.txt')
      .expect(200)
      .expect('Content-Disposition', /attachment;.*filename=('UppeRCaSeLowerCASE\.txt'|"UppeRCaSeLowerCASE\.txt")/)
      .end((err, res) => {
        if (err) return done(err);
        res.text.should.equal('My filename has uppercase and lowercase characters');
        done();
      });
  });

  it('should handle files start with a number', (done) => {
    request.agent(baseURL)
      .get('/file/0.txt')
      .expect(200)
      .expect('Content-Disposition', /attachment;.*filename=('0\.txt'|"0\.txt")/)
      .end((err, res) => {
        if (err) return done(err);
        res.text.should.equal('My filename starts with a number');
        done();
      });
  });

  it('should handle files with no extension', (done) => {
    request.agent(baseURL)
      .get('/file/identitycrisis')
      .expect(200)
      .expect('Content-Disposition', /attachment;.*filename=('identitycrisis'|"identitycrisis")/)
      .end((err, res) => {
        if (err) return done(err);
        res.text.should.equal('I have no extension');
        done();
      });
  });

  it('should reply with a 404 if file does not exist', (done) => {
    request(baseURL)
      .get('/file/filethatdoesnotexist')
      .expect(404, done);
  });

  it('should reply with a 405 if a method other than GET is used', (done) => {
    request(baseURL)
      .post('/file/hello.txt')
      .expect(405)
      .end((err) => {
        if (err) return done(err);
        request(baseURL)
          .put('/file/hello.txt')
          .expect(405)
          .end((err) => {
            if (err) return done(err);
            request(baseURL)
              .del('/file/hello.txt')
              .expect(405, done);
          });
      });
  });
});
