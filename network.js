/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
const exec = require('child_process').exec;
const fs = require('fs');
const readline = require('readline');
var ps = require('ps-node');

function network() {
  var self = this;
}

network.prototype.getConnList = function(callback) {
  var data = {};
  data.connections = [];

  const rl = readline.createInterface({
    input: fs.createReadStream('/proc/net/nf_conntrack')
  });

  rl.on('line', function(line) {
    console.log('Line from file:' + line);
    var conn = {};
    
    var arr = line.split(/\s+/);
    console.log('length:' + arr.length);
    for(var key in arr) {
      console.log(arr[key]);
      var i = arr[key].indexOf('src=');
      if(-1 != i) {
        conn.src = arr[key].slice(i + 4);
	console.log(conn.src);
	continue;
      }

      i = arr[key].indexOf('dst=');
      if(-1 != i) {
        conn.dst = arr[key].slice(i + 4);
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

    callback(data);
  });
}

module.exports = network;


