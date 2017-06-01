/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
const exec = require('child_process').exec;
var ps = require('ps-node');

function vpn() {
  var self = this;
}

vpn.prototype.getVpnStatus= function() {
/*  var cmd = 'uci set firewall.block_' + 
    mac + '.enabled=' + enabled + ' && uci commit';
  console.log(cmd);
  exec(cmd, 
    (error, stdout, stderr) => {
    if (error) {
      console.error('exec error:');
    }
    console.log('stdout' + stdout);
    console.log('stderr' + stderr);
  });
*/
  ps.lookup({command: '/usr/sbin/openvpn'}, function(err, resultList) {
    if (err) {
      throw new Error(err);
    } 

    resultList.forEach(function(process) {
      if (process) {
        console.log('Process is: ' + process.command);
      }
    });
  });
}

vpn.prototype.toggle = function(value){
  var cmd;
  if (value) {
    cmd = '/etc/init.d/openvpn start';
  } else {
    cmd = '/etc/init.d/openvpn stop';
  }

  exec(cmd,
    (error, stdout, stderr) => {
      if (error) {
        console.error('exec error: ');
      }
      console.log('stdout' + stdout);
      console.log('stderr' + stderr);
   });
}

module.exports = vpn;


