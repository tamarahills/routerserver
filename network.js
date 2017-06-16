/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
const exec = require('child_process').exec;
const fs = require('fs');
const readline = require('readline');
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
    NetworkConn.dnsCache.set(msg.dst, msg.host);
    console.log('Caching:'+ msg.dst + ':'+msg.host + ': size:' + NetworkConn.dnsCache.size);
  }.bind(this));
}

function logMap(value, key, map) {
  console.log(key + ' : ' + value);
}

function printCache() {
  console.log('CACHE START===========');
  NetworkConn.dnsCache.forEach(logMap);
  console.log('CACHE END=============');
}

NetworkConn.prototype.addLanHost = function(ip, host) {
  NetworkConn.dnsCache.set(ip, host);
  NetworkConn.lanHostnames.set(ip, host);
}

NetworkConn.prototype.getConnList = function(callback) {

  var data = {};
  data.connections = [];
  var lineCount = 0;

  console.log('===========NEW REQUEST==========: ' + data.connections.length);
  const rl = readline.createInterface({
    input: fs.createReadStream('/proc/net/nf_conntrack')
  });

  rl.on('line', function(line) {
    lineCount++;
    var conn = {};
    console.log('line is: '+ line);    
    var arr = line.split(/\s+/);
    var dstFound = false;
    var srcFound = false;
    var bytesFound = false;
    var dport = 0;
    var sport = 0;
    for(var key in arr) {
      var i = arr[key].indexOf('src=');
      if(-1 != i && !srcFound) {
        var srcAddr = arr[key].slice(i + 4);
	if (NetworkConn.lanHostnames.has(srcAddr)) {
	  conn.src = NetworkConn.lanHostnames.get(srcAddr);
	} else {
          conn.src = srcAddr;
	}
	srcFound = true;
	continue;
      }

      i = arr[key].indexOf('dst=');
      if(-1 != i && !dstFound) {
        var dest = arr[key].slice(i + 4);
	dstFound = true;
	if (NetworkConn.dnsCache.has(dest)) {
	  var host = NetworkConn.dnsCache.get(dest);
	  conn.dst = host;
	} else {
	  var msgData = { "dst": dest };
	  console.log('CACHE MISS: ' + dest);
	  NetworkConn._retrieveChild.send(msgData);
          conn.dst = dest;
	  NetworkConn.dnsCache.set(dest, dest);
	}
        continue;
      }

      i = arr[key].indexOf('dport=')
      if (-1 != i) {
        var port = arr[key].slice(i+6);
	dport = parseInt(port);
	if(dport == 53) {
	  break;
	}
      }

      i = arr[key].indexOf('sport=')
      if (-1 != i) {
        var port = arr[key].slice(i+6);
	sport = parseInt(port);
	if (sport == 53) {
	  break;
	}
      }

      i = arr[key].indexOf('bytes=');
      if(-1 != i && !bytesFound) {
        conn.bytes = arr[key].slice(i + 6);
	bytesFound = true;
	continue;
      }
      if(srcFound && dstFound && bytesFound) {
        break;
      }
    }
    
    if (dport == 53 || sport == 53) {
    } else if(conn.dst == '127.0.0.1' && conn.src == '127.0.0.1') {
    } else {
      console.log('ADDING:  ' + JSON.stringify(conn));
      data.connections.push(conn);
    }
  });
  rl.on('close', function() {
    console.log('Close called: ' + data.connections.length);
    rl.close();
    data.connections.sort(function(a, b) {
      return parseFloat(b.bytes) - parseFloat(a.bytes);
    });

    for(var key in data.connections) {
      var pr = getReadableBytes(data.connections[key].bytes);
      data.connections[key].bytes = pr;
    }
    console.log('==========RETURNING DATA=========: ' + data.connections.length);
    console.log('==========FINAL LINECOUNT: ======: ' + lineCount);
    callback(data);
  });
}

NetworkConn.dnsCache = new Map();
NetworkConn.lanHostnames = new Map();

module.exports = NetworkConn;


