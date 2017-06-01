/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';
var async = require('async');
var express = require('express');
var port    =   process.env.PORT || 8080;
const execFile = require('child_process').execFile;
var Logger = require('./logger');
var firewall = require('./firewall');
var network= require('./network');
var vpn = require('./vpn');
var bodyParser = require('body-parser');
let util = require('util');
let http = require('http');
var nconf = require('nconf');
var app = express();
var logger = new Logger().getLogger();
var fw = new firewall();
var vp = new vpn();
var network = new network();
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

app.post('/toggleVpn', function(req,res) {
  logger.info('toggleVpn post');
  console.log('value is: ' + req.body.enabled);
  vp.toggle(req.body.value);
  res.status(200).send('OK');;
});

app.post('/pause', function(req, res) {
  logger.info('pause post');
  console.log(req.body);
  fw.checkIfRuleExists(req.body.mac, function(exists) {
    if(exists) {
      console.log('rule exists');
      fw.enableRule(req.body.mac, req.body.value);
    } else {
      console.log('rule does not exist.');
      if (req.body.value) {
        fw.createRule(req.body.mac);
      }
    }
  });
  res.status(200).send('OK');
});

app.post('/devices', function(req, res) {
  logger.info('devices post');
  execFile('/root/tamara/routerserver/wifi.sh', (error, stdout, stderr) => {
    if(error) {
      logger.log('exec error');
      console.log(stderr);
      res.status(500).send('error');
    }
    var devices = { deviceList: [] };
    var data = stdout.split(/(?:\r\n|\r|\n)/g);
    async.each(data, function(strEntry, callback) {
      var addrs = strEntry.split('\t');
      fw.isRuleEnabled(addrs[2], function(enabled) {
        console.log('Got callback: enabled is: ' + enabled);

	if(addrs[0]) {
          devices.deviceList.push({"host": addrs[1], "IP": addrs[0], 
            "mac": addrs[2], "enabled": enabled});
	}
	callback();
      });
    }, function(err) {
      console.log('All processed');
      res.status(200).send(devices);
    });
  });
});

app.get('/connections', function(req, res) {
  network.getConnList(function(payload) {
    console.log('Payload received');
    res.status(200).send(payload);
  });;
});

// Start the server listening.
app.listen(process.env.PORT || 8080, function() {
	logger.info('Server started on port ' + (process.env.PORT || 8080));
});
