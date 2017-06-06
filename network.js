/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
const exec = require('child_process').exec;
const fs = require('fs');
const readline = require('readline');
var ps = require('ps-node');
var childProcess = require('child_process');
const dns = require('dns');

function NetworkConn() {
}

function getReadableBytes(fileSizeInBytes) {
  var i = -1;
  var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
   } while (fileSizeInBytes > 1024);
  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

NetworkConn.prototype.createProcess = function() {
  NetworkConn._retrieveChild = childProcess.fork('./reverse.js');
  NetworkConn._retrieveChild.on('message', function(msg) {
    console.log('Inserting:'+ msg.dst + ':'+msg.host);
    NetworkConn.dnsCache.set(msg.dst, msg.host);
  }.bind(this));
}

NetworkConn.prototype.addLanHost = function(ip, host) {
  NetworkConn.dnsCache.set(ip, host);
}

NetworkConn.prototype.getConnList = function(callback) {
  var data = {};
  data.connections = [];

  const rl = readline.createInterface({
    input: fs.createReadStream('/proc/net/nf_conntrack')
  });

  rl.on('line', function(line) {
    var conn = {};
    
    var arr = line.split(/\s+/);
    for(var key in arr) {
      var i = arr[key].indexOf('src=');
      if(-1 != i) {
        conn.src = arr[key].slice(i + 4);
	continue;
      }

      i = arr[key].indexOf('dst=');
      if(-1 != i) {
        var dest = arr[key].slice(i + 4);
	if (NetworkConn.dnsCache.has(conn.dst)) {
	  var host = NetworkConn.dnsCache.get(conn.dst);
	  console.log('VALUE CACHED:'+conn.dst + ':' + host);
	  conn.dst = host;
	} else {
	  var msgData = { "dst": dest };
	  console.log('SENDING DATA');
	  NetworkConn._retrieveChild.send(msgData);
          conn.dst = dest;
	}
        continue;
      }

      i = arr[key].indexOf('bytes=');
      if(-1 != i) {
        conn.bytes = arr[key].slice(i + 6);
	continue;
      }
    }
    data.connections.push(conn);
  });
  rl.on('close', function() {
    console.log('Close called');
    rl.close();
    data.connections.sort(function(a, b) {
      return parseFloat(b.bytes) - parseFloat(a.bytes);
    });

    for(var key in data.connections) {
      var pr = getReadableBytes(data.connections[key].bytes);
      data.connections[key].bytes = pr;
    }
    callback(data);
  });
}

NetworkConn.dnsCache = new Map();
NetworkConn.lanHostnames = new Map();

module.exports = NetworkConn;


