

const request = require('request');
const config = require('../config');

// seedData
let seedData = require('./seedData');

// total callbacks (one for each model)
let totalCbs = 0;
let cbCnt = 0;

/**
* Recursive function that goes through
* seedData populating each item of it
*/
const seedModel = function (done, s) {
  if (s != undefined) {
    seedData = s;
  }
  totalCbs = seedData.length;

  for (let i = 0; i < seedData.length; i++) {
    const form = {};
    form[config.form._id] = seedData[i]._id;
    form[config.form.name] = seedData[i].name;
    form[config.form.dataURL] = seedData[i].dataURL;
    form[config.form.bookmarked] = seedData[i].bookmarked;

    request.post(`${config.url}/favorites`, {
      form,
    }, (error, response, body) => {
      cbCnt++;
      if (cbCnt == totalCbs) {
        done(seedData);
      }
    });
  }
};

/**
* This is where everything starts
*/
module.exports.seed = function (done, s) {
  seedModel(done, s);
};
