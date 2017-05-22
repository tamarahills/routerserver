/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';
var express = require('express');
var port    =   process.env.PORT || 8080;
var Logger = require('./logger');
var bodyParser = require('body-parser');
let util = require('util');
let http = require('http');
var nconf = require('nconf');
var app = express();
var logger = new Logger().getLogger();
// Use nconf to get the configuration for different APIs we are using.
nconf.argv()
   .env()
   .file({ file: './config.json' });


// This is a middleware statement and needs to stay here and not be rearranged.
app.use('/item', function(req, res, next) {
  // It seems only the originalUrl is interesting, for now not logging the others.
  logger.info('originalUrl:', req.originalUrl); // '/admin/new'
  next();
});


// These need to be declared ahead of any of the post or get handlers.
app.use(bodyParser.json());

/*
 */
app.post('/item',  function(req, res) {
  logger.info('got an item post');
  var deviceid = req.body.deviceid;
  var item = req.body.item;
  var type = req.body.rec_type || 'visual';
  logger.info('deviceid: ' + deviceid + '. item: ' + item);
    res.status(200).send('OK');
});

app.get('/', function(req, res) {
  res.send('This is a Router Server.');
});

app.get('/about', function(req, res) {
  res.send('This is a Router Server.');
});

app.post('/devices', function(req, res) {
  logger.info('devices post');
  var devices = '{ "deviceList" : [' +
      '{ "host":"Tamaras Macbook" , "IP":"10.19.2.160" },' +
      '{ "host":"iPad Mini" , "IP":"192.168.1.3" },' +
      '{ "host":"Lenovo2006" , "IP":"192.168.1.4" } ]}';
  res.status(200).send(devices);
});

// Start the server listening.
app.listen(process.env.PORT || 8080, function() {
	logger.info('Server started on port ' + (process.env.PORT || 8080));
});
