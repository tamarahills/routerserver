/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';
var express = require('express');
var port    =   process.env.PORT || 8080;
const execFile = require('child_process').execFile;
var Logger = require('./logger');
var firewall = require('./firewall');
var bodyParser = require('body-parser');
let util = require('util');
let http = require('http');
var nconf = require('nconf');
var app = express();
var logger = new Logger().getLogger();
var fw = new firewall();
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
  //Firewall.enableRule('4C:32:75:81:C7:12');
  //fw.createRule('xxblockipad');
  fw.isRuleEnabled('xxblockipad');
  res.send('This is a Router Server.');
});

app.post('/vpnStatus', function(req, res) {
  logger.info('vpn post');
  var vpn = '{"vpnStatus" : "enabled"}';
  res.status(200).send(vpn);
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
    for(var i = 0; i < data.length -1; i++) {
      var addrs = data[i].split('\t');
      fw.isRuleEnabled(addrs[2], function(enabled) {
        console.log('Got Callback:  enabled is: ' + enabled);
        devices.deviceList.push({"host": addrs[1], "IP": addrs[0], 
          "enabled": false});
      });
    }
    res.status(200).send(devices);
  });
});

// Start the server listening.
app.listen(process.env.PORT || 8080, function() {
	logger.info('Server started on port ' + (process.env.PORT || 8080));
});
