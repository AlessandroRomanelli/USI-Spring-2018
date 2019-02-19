#!/usr/bin/env node
/*
 *  Basic node.js HTTP server
 *
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const routes = Object.create(null);

const typesMap = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.ogv': 'video/ogg',
  '.mpeg': 'video/mpeg',
  '.svg': 'image/svg+xml',
  '.zip': 'application/zip',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
};

const analyzeFile = (text) => {
  const map = {};
  const words = text.replace(/\W/g, ' ').trim().split(/\s+/g);
  words.forEach((word) => {
    if (map[word]) {
      map[word] += 1;
    } else {
      map[word] = 1;
    }
  });
  return map;
};


// Configure your routing table here...
routes.file = (req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(405, {});
    res.end();
    return;
  }
  const filePath = url.parse(req.url).pathname.slice(6).replace(/%20/g, ' ');
  const fileName = path.basename(req.url).replace(/%20/g, ' ');
  const fileExt = path.extname(fileName);
  fs.readFile(`${__dirname}/NodeStaticFiles/${filePath}`, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, {});
        res.end();
        return;
      }
      console.error(err);
      throw err;
    }
    res.setHeader('Content-Type', typesMap[fileExt] || 'text/plain');
    res.setHeader('Content-Disposition', `attachment;filename='${fileName}'`);
    res.end(data);
  });
};

routes.explore = (req, res) => {
  const root = `${__dirname}/NodeStaticFiles`;
  let dirReq = req.url.replace('/explore', '');
  if (dirReq === '') { dirReq = '/'; }
  let html = `<html><body><h1>Table of contents for ${dirReq}</h1><ul>`;
  fs.readdir(`${path.normalize(root + dirReq)}`, (err, fileList) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, {});
        res.end();
        return;
      }
      console.error(err);
      throw err;
    }
    let pathName = path.normalize(`/explore${dirReq}`);
    html += `<li><a href='${pathName}'>.</a></li>`;
    if (['', '/'].indexOf(dirReq) === -1) {
      let parentDir = dirReq.split('/');
      parentDir.pop();
      parentDir = parentDir.join('/');
      pathName = path.normalize(`/explore${parentDir}`);
      html += `<li><a href='${pathName}'>..</a></li>`;
    }

    let count = 0;
    function addHTMLRow(file, done) {
      fs.stat(`${path.normalize(`${root + dirReq}/${file}`)}`, (err, data) => {
        if (err) { console.error(err); throw err; }
        if (data.isDirectory()) {
          html += `<li><a href='${path.normalize(`/explore${dirReq}/${file}`)}'>${file}</a>`;
        } else {
          html += `<li><a href='${path.normalize(`/file${dirReq}/${file}`)}'>${file}</a>`;
        }
        done();
      });
    }

    fileList.forEach((file) => {
      addHTMLRow(file, () => {
        if ((count += 1) === fileList.length) {
          html += '</ul></body></html>';
          res.writeHead(200, {
            'Content-Type': 'text/html',
          });
          res.end(html);
        }
      });
    });

    if (fileList.length === 0) {
      html += '</ul></body></html>';
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
      res.end(html);
    }
  });
};

routes.upload = (req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    let html = '<html><body>';
    html += "<form action='/upload' enctype='multipart/form-data' method='POST' id='upload-form'>";
    html += "<input type='file' name='file'><input type='submit' name='submit'></form>";
    html += '</body></html>';
    res.end(html);
  } else if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = '/Users/alessandroromanelli/tmp';
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) { console.error(err); throw err; }
      fs.rename(files.file.path, `${__dirname}/NodeStaticFiles/${files.file.name}`, (err) => {
        if (err) { console.error(err); throw err; }
        res.writeHead(302, {
          Location: '/explore',
        });
        res.end();
      });
    });
  } else {
    res.statusCode = 405;
    res.end();
  }
};

routes.stats = (req, res) => {
  const { query } = url.parse(req.url);
  const filePath = query.split('=')[1];
  const fileName = path.basename(filePath);
  const fileExt = path.extname(filePath);
  if (fileExt !== '.txt' && fileExt !== '.html') {
    res.writeHead(400, {});
    res.end();
    return;
  }
  fs.readFile(`${__dirname}/NodeStaticFiles/${filePath}`, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, {});
        res.end();
        return;
      }
      console.error(err);
      throw err;
    }
    const frequencies = analyzeFile(data.toString());
    const keys = Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]);
    let html = `<html><body><table id='frequency-tbl'><h4>Word count for file: "${fileName}"</h4><tr><th>Word</th><th>Frequency</th></tr>`;
    keys.forEach((key) => {
      html += `<tr><td class='word'>${key}</td><td class='frequency'>${frequencies[key]}</td></tr>`;
    });
    html += '</table></body></html>';
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(html);
  });
};

routes.cloud = (req, res) => {
  const { query } = url.parse(req.url);
  const filePath = query.split('=')[1];
  const fileName = path.basename(filePath);
  const fileExt = path.extname(filePath);
  if (fileExt !== '.txt' && fileExt !== '.html') {
    res.writeHead(400, {});
    res.end();
    return;
  }
  fs.readFile(`${__dirname}/NodeStaticFiles/${filePath}`, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, {});
        res.end();
        return;
      }
      console.error(err);
      throw err;
    }
    const frequencies = analyzeFile(data.toString());
    const keys = Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]);
    let html = '<html><body style="height: 100vh; width: 100vw">';
    const maxFreq = frequencies[keys[0]];
    keys.forEach((key, index) => {
      const pos = { x: 0.5, y: 0.5 };
      const rDegree = Math.random() * 360;
      const rDist = Math.random() * 0.5 - ((Math.sqrt(frequencies[key]) / Math.sqrt(maxFreq)) * 0.5);
      let orientation;
      if (rDegree >= 315 && rDegree <= 45) {
        orientation = 180;
      } else if (rDegree > 45 && rDegree < 135) {
        orientation = 90;
      } else if (rDegree >= 135 && rDegree <= 225) {
        orientation = 0;
      } else {
        orientation = 270;
      }
      pos.x = 0.5 + Math.cos(rDegree) * rDist;
      pos.y = 0.5 + Math.sin(rDegree) * rDist;

      const pow = 1.01;
      html += `<span style='position: absolute;
        top: ${pos.y * 100}%; left: ${pos.x * 100}%;
        font-size: ${((frequencies[key] ** pow) / (maxFreq ** pow)) * 10}em;
        z-index: ${index};
        transform: rotate(${orientation}deg) translate(-50%, -50%);
        opacity: ${(keys.length - index) / keys.length}'>${key}</span>`;
    });
    html += '</body></html>';
    if (req.headers.accept === 'application/json') {
      const json = JSON.stringify(frequencies);
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(json);
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
      res.end(html);
    }
  });
};

routes[''] = (req, res) => {
  res.writeHead(200, {});
  res.end('<html><body><h1>Welcome to Assignment 4 of Web Atelier</h1><p>Make haste, to the explorer page!<br><a href=\'/explore/\'>Right away, sire!</a></p></body></html>');
};

// Main server handler
function onRequest(req, res) {
  const { pathname } = url.parse(req.url);
  const uri = pathname.split('/', 3)[1];
  if (typeof routes[uri] === 'function') {
    routes[uri](req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
}


http.createServer(onRequest).listen(3000);
console.log('Server started at localhost:3000');
