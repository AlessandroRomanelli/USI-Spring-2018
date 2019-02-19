const request = require('supertest');


const should = require('should');


const cheerio = require('cheerio');
const config = require('./config');

const baseURL = config.baseURL;

describe('Exercise 3. Directory Explorer ', () => {
  describe('When exploring root directory, we:', (done) => {
    const files = [
      '0.txt',
      'UppeRCaSeLowerCASE.txt',
      'afox.gif',
      'asq.png',
      'bunny.mp4',
      'bunny.ogv',
      'ex-node.pdf',
      'foo.js',
      'freq.html',
      'freq.txt',
      'four-seasons.mp3',
      'hello world node.txt',
      'hello.txt',
      'identitycrisis',
      'images.json',
      'index.html',
      'myfiles.zip',
      'simple.txt',
      'style.css',
      'thing.jpg',
      'turing.txt'];

    const dirs = [
      'level-1',
      'icons',
    ];

    let $; let linksArr; let links; let
      dirFound;

    before((done) => {
      request(baseURL)
        .get('/explore/')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .end((err, res) => {
          if (err) return done(err);

          $ = cheerio.load(res.text);
          linksArr = [];
          $('a[href]').each((index, el) => {
            const href = $(el).attr('href').toString();
            linksArr.push(href);
          });
          links = linksArr.join(' ');
          done();
        });
    });


    it('should have proper links for files', () => {
      for (let i = 0, l = files.length; i < l; i++) {
        links.should.containEql(`file/${files[i]}`);
      }
    });

    it('should have proper links for directories', () => {
      for (let i = 0, l = dirs.length; i < l; i++) {
        dirFound = false;
        // check for relative or absolute path
        if (links.indexOf(`explore/${dirs[i]}`) !== -1
          || links.indexOf(dirs[i]) !== -1) {
          dirFound = true;
        }
        dirFound.should.equal(true);
      }
    });

    it('should have a link for current folder', () => {
      let foundCurrent = false;


      const currentURL = 'explore/';

      for (let i = 0, l = linksArr.length, c = currentURL.length; i < l; i++) {
        // link should end with currentURL
        if (linksArr[i].indexOf(currentURL, linksArr[i].length - c) !== -1) {
          foundCurrent = true;
        }
      }
      foundCurrent.should.equal(true);
    });

    it('should NOT have a link for the parent folder', () => {
      let foundParent = false;
      const parentURLs = [
        'explore/..',
        'explore/../'];

      for (let i = 0, l = linksArr.length; i < l; i++) {
        // link should end with currentURL

        for (let j = 0; j < parentURLs.length; j++) {
          if (linksArr[i].indexOf(parentURLs[j], linksArr[i].length - parentURLs[j].length) !== -1) {
            foundParent = true;
          }
        }
      }
      foundParent.should.equal(false);
    });
  });


  describe('When exploring a level 4 directory, we', (done) => {
    const files = [
      'bunny-is-back.mp4',
      'dafiles.zip',
      'ex.pdf',
      'foo.js',
      'hello-level-4.txt',
      'identitycrisis-take2',
      'one-season.mp3',
      'screen.css',
      'strange.jpg',
      'test.html'];

    const dirs = [
      'level-5',
      'a-dir',
      'another-dir'];

    let $; let linksArr; let links; let
      dirFound;
    const level4Path = 'level-1/level-2/level-3/level-4/';

    before((done) => {
      request(baseURL)
        .get(`/explore/${level4Path}`)
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .end((err, res) => {
          if (err) return done(err);

          $ = cheerio.load(res.text);
          linksArr = [];
          $('a[href]').each((index, el) => {
            const href = $(el).attr('href').toString();
            linksArr.push(href);
          });
          links = linksArr.join(' ');

          done();
        });
    });


    it('should have proper links for files', () => {
      for (let i = 0, l = files.length; i < l; i++) {
        links.should.containEql(`file/${level4Path}${files[i]}`);
      }
    });

    it('should have proper links for directories', () => {
      for (let i = 0, l = dirs.length; i < l; i++) {
        dirFound = false;
        // check for relative or absolute path
        if (links.indexOf(`explore/${level4Path}${dirs[i]}`) !== -1
        || links.indexOf(dirs[i]) !== -1) {
          dirFound = true;
        }
        dirFound.should.equal(true);
      }
    });

    it('should have a link for the current folder', () => {
      let foundCurrent = false;
      const currentURL = `explore/${level4Path}`;

      for (let i = 0, l = linksArr.length, c = currentURL.length; i < l; i++) {
        // link should end with currentURL
        if (linksArr[i].indexOf(currentURL, linksArr[i].length - c) !== -1) {
          foundCurrent = true;
        }
      }
      foundCurrent.should.equal(true);
    });

    it('should have link for the parent folder', () => {
      let foundParent = false;
      const parentURLs = [
        'explore/level-1/level-2/level-3',
        'explore/level-1/level-2/level-3/',
        'explore/level-1/level-2/level-3/level-4/..',
        'explore/level-1/level-2/level-3/level-4/../'];

      for (let i = 0, l = linksArr.length; i < l; i++) {
        // link should end with currentURL

        for (let j = 0; j < parentURLs.length; j++) {
          if (linksArr[i].indexOf(parentURLs[j], linksArr[i].length - parentURLs[j].length) !== -1) {
            foundParent = true;
          }
        }
      }
      foundParent.should.equal(false);
    });
  });
});
