const request = require('supertest');


const fs = require('fs');


const path = require('path');


const should = require('should');


const cheerio = require('cheerio');
const config = require('./config');

const baseURL = config.baseURL;

describe('Exercise 4. Upload', () => {
  describe('on /GET upload', () => {
    it('should return a form with proper field types and names', (done) => {
      request(baseURL)
        .get('/upload')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .end((err, res) => {
          if (err) return done(err);

          const $ = cheerio.load(res.text);
          const $uploadForm = $('form#upload-form');
          $uploadForm.length.should.equal(1);
          $uploadForm.find('input[type="file"][name="file"]').length.should.equal(1);
          $uploadForm.find('input[type="submit"][name="submit"]').length.should.equal(1);
          if ($uploadForm.attr('action')) {
            const action = $uploadForm.attr('action').trim();
            action.should.match(s => s === '' || s === '/upload' || s === '/upload/');
          }
          done();
        });
    });
  });

  describe('on /POST upload', () => {
    before(() => {
      const lepath = path.resolve(config.projectRoot, './NodeStaticFiles/upload-test.jpg');
      if (fs.existsSync(lepath)) {
        fs.unlinkSync(lepath);
      }
    });

    after(() => {
      console.log(config.projectRoot);
      const lepath = path.resolve(config.projectRoot, './NodeStaticFiles/upload-test.jpg');
      if (fs.existsSync(lepath)) {
        fs.unlinkSync(lepath);
      }
    });

    it('should successfuly upload an image file ', (done) => {
      request(baseURL)
        .post('/upload')
        .set('Accept', 'application/json')
        .attach('file', path.resolve(__dirname, './fixtures/upload-test.jpg'))
        .expect(302)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('the uploaded image file should be in the root dir', (done) => {
      request(baseURL)
        .get('/explore')
        .end((err, res) => {
        // new file should be listed in the root dir
          console.log(res.text);
          res.text.should.containEql('file/' + 'upload-test.jpg');
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
