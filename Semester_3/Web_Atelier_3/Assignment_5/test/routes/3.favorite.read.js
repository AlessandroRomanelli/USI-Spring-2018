

const should = require('should');
const request = require('supertest');
const config = require('../../config');
const seedDb = require('../seed');
const favsOriginal = require('../seedData');

const favs = [];
for (let i = 0; i < favsOriginal.length; i++) {
  const o = {};
  o[config.form._id] = favsOriginal[i]._id;
  o[config.form.name] = favsOriginal[i].name;
  o[config.form.dataURL] = favsOriginal[i].dataURL;
  o[config.form.bookmarked] = favsOriginal[i].bookmarked;
  favs.push(o);
}

describe('Task 3: Testing Read for /favorites routes', () => {
  before(seed);

  describe('GET /favorites', () => {
    it('should list all the favs with correct data', (done) => {
      request(config.url)
        .get('/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end((err, res) => {
          const resFavs = JSON.parse(res.text);
          resFavs.forEach((fav) => {
            for (let i = 0; i < favs.length; i++) {
              if (favs[i][config.form._id] == fav[config.form._id]) {
                should.equal(fav[config.form.dataURL], favs[i][config.form.dataURL]);
                should.equal(fav[config.form.bookmarked], favs[i][config.form.bookmarked]);
                should.equal(fav[config.form.name], favs[i][config.form.name]);
              }
            }
          });
          done();
        });
    });
  });

  describe('GET /favorites/:favoriteid', () => {
    it('should get the favorite with correct data', (done) => {
      request(config.url)
        .get(`/favorites/${favs[1][config.form._id]}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end((err, res) => {
          const resFav = JSON.parse(res.text);
          should.equal(resFav[config.form._id], favs[1][config.form._id]);
          should.equal(resFav[config.form.dataURL], favs[1][config.form.dataURL]);
          should.equal(resFav[config.form.bookmarked], favs[1][config.form.bookmarked]);
          should.equal(resFav[config.form.name], favs[1][config.form.name]);
          done();
        });
    });

    it('should respond with a 404 if the favorite does not exist', (done) => {
      request(config.url)
        .get('/favorites/notValidId')
        .set('Accept', 'application/json')
        .expect(404, done);
    });
  });

  describe('GET /favorites/search', () => {
    it(`should get the favorite with correct data: GET /favorites/search?${config.form._id}`, (done) => {
      request(config.url)
        .get(`/favorites/search?${config.form._id}=${favs[1][config.form._id]}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end((err, res) => {
          const resFavArray = JSON.parse(res.text);
          should.equal(resFavArray.length, 1);
          const resFav = resFavArray[0];
          should.equal(resFav[config.form._id], favs[1][config.form._id]);
          should.equal(resFav[config.form.dataURL], favs[1][config.form.dataURL]);
          should.equal(resFav[config.form.bookmarked], favs[1][config.form.bookmarked]);
          should.equal(resFav[config.form.name], favs[1][config.form.name]);
          done();
        });
    });

    it(`should get the favorite with correct data: GET /favorites/search?${config.form._id}&${config.form.name}`, (done) => {
      request(config.url)
        .get(`/favorites/search?${config.form._id}=${favs[5][config.form._id]}&${config.form.name}=${favs[5][config.form.name]}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end((err, res) => {
          const resFav = JSON.parse(res.text)[0];
          should.equal(resFav[config.form._id], favs[5][config.form._id]);
          should.equal(resFav[config.form.dataURL], favs[5][config.form.dataURL]);
          should.equal(resFav[config.form.bookmarked], favs[5][config.form.bookmarked]);
          should.equal(resFav[config.form.name], favs[5][config.form.name]);
          done();
        });
    });

    it(`should get empty array if there is no match: GET /favorites/search?${config.form.name}`, (done) => {
      request(config.url)
        .get(`/favorites/search?&${config.form.name}=NoName`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end((err, res) => {
          const resFavArray = JSON.parse(res.text);
          should.equal(resFavArray.length, 0);
          done();
        });
    });
  });
});

function seed(done) {
  // seed the db
  seedDb.seed((seedData) => {
    done();
  }, favsOriginal);
}
