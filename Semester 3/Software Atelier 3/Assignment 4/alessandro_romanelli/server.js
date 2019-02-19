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
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mpeg',
  '.mpeg': 'video/mpeg',
  '.svg': 'image/svg+xml',
  '.zip': 'application/zip',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
};

const analyzeFile = (text) => {
  const map = {};
  const words = text.split(' ');
  // const words = text.split(/[, .[\]{}\n]/g).filter(x => x !== '');
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
  const filePath = url.parse(req.url).pathname.slice(6).replace(/%20/g, '\\ ');
  const fileName = path.basename(req.url);
  const fileExt = path.extname(fileName);
  fs.readFile(`${__dirname}/NodeStaticFiles/${filePath}`, 'utf8', (err, data) => {
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
  const dirReq = req.url.slice(9);
  let html = `<html><body><h1>Table of contents for ${dirReq}</h1><ul>`;
  fs.readdir(`${root}/${dirReq}`, (err, fileList) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, {});
        res.end();
        return;
      }
      console.error(err);
      throw err;
    }
    html += `<li><a href='/explore/${dirReq}'>.</a></li>`;
    let parentDir = dirReq.split('/');
    parentDir.pop();
    parentDir = parentDir.join('/');
    html += `<li><a href='/explore/${parentDir}'>..</a></li>`;
    fileList.forEach((file) => {
      const isDir = fs.statSync(`${root}/${dirReq}/${file}`).isDirectory();
      const route = (isDir) ? 'explore' : 'file';
      html += `<li><a href='/${route}/${dirReq}/${file}'>${file}</a>`;
    });
    html += '</ul></body></html>';
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(html);
  });
};

routes.upload = (req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    let html = '<html><body>';
    html += "<form action='upload' enctype='multipart/form-data' method='POST' id='upload-form'>";
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
      }
      console.error(err);
      throw err;
    }
    const frequencies = analyzeFile(data.toString());
    const keys = Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]);
    let html = `<html><body><table id='frequency-tbl'><h4>Word count for file: "${fileName}"</h4><tr><th>Word</th><th>Frequency</th></tr>`;
    keys.forEach((key) => {
      html += `<tr><td class='word'>${key}</td><td>${frequencies[key]}</td></tr>`;
    });
    html += '</table></body></html>';
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
      }
      console.error(err);
      throw err;
    }
    const frequencies = analyzeFile(data.toString());
    const keys = Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]);
    let html = '<html><body style="height: 100vh; width: 100vw">';
    keys.forEach((key, index) => {
      const pos = { x: 0.5, y: 0.5 };
      const rDegree = Math.random() * 360;
      const rDist = Math.random() * 0.5;
      pos.x = 0.5 + Math.cos(rDegree) * rDist;
      pos.y = 0.5 + Math.sin(rDegree) * rDist;
      html += `<span style='position: absolute;
        top: ${pos.y * 100}%; left: ${pos.x * 100}%;
        font-size: ${frequencies[key] / 3}em;
        z-index: ${index};
        opacity: ${50 / index}'>${key}</span>`;
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

// Main server handler
function onRequest(req, res) {
  const { pathname } = url.parse(req.url);
  const uri = pathname.split('/', 3)[1];
  if (typeof routes[uri] === 'function') {
    routes[uri](req, res);
  } else {
    res.writeHead(404, {});
    res.end();
  }
}


http.createServer(onRequest).listen(3000);
console.log('Server started at localhost:3000');
