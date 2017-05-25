/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
const exec = require('child_process').exec;

function firewall() {
  var self = this;
}

firewall.prototype.enableRule = function(srcMac, value) {
  var enabled = '0';
  if (value) {
    enabled = '1';
  }

  var mac = srcMac.replace(/:/g, '_');
  var cmd = 'uci set firewall.block_' + 
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
}

firewall.prototype.checkIfRuleExists = function(srcMac, callback) {
  var mac = srcMac.replace(/:/g, '_');
  var cmd = 'uci get firewall.block_' + mac;
  console.log(cmd);
  var exists = false;
  exec(cmd, 
    (error, stdout, stderr) => {
    if (error) {
      console.error('exec error:');
    } else {
      var retString = stdout.replace(/[\n\r]+/g,'').trim();
      console.log('stdout is:' + retString + '.');
      if (0 == retString.localeCompare('rule')) {
        console.log('Rule exists');
	exists = true;
      } else {
        console.log('Rule does not exist.');
      }
    }
    console.log('stdout' + stdout);
    console.log('stderr' + stderr);
    callback(exists);
  });
}

firewall.prototype.createRule = function(srcMac) {
  var mac = srcMac.replace(/:/g, '_');
  console.log('mac replaced is: ' + mac);
  var ruleNamePrefix = 'uci set firewall.block_' + mac;
  var cmd = ruleNamePrefix + '=rule && ' +
    ruleNamePrefix + '.src=lan && ' +
    ruleNamePrefix + '.dest=wan && ' +
    ruleNamePrefix + '.target=REJECT && ' +
    ruleNamePrefix + '.weekdays=\'Sun Mon Tues Wed Thurs Fri Sat\' && ' +
    ruleNamePrefix + '.src_mac=' + srcMac + ' && ' +
    ruleNamePrefix + '.enabled=1 && uci commit';
  console.log(cmd);
  exec(cmd, 
    (error, stdout, stderr) => {
    if (error) {
      console.error('exec error:');
    }
    console.log('stdout' + stdout);
    console.log('stderr' + stderr);
  });
}

// TODO: Make it return a better error code.
firewall.prototype.isRuleEnabled = function(srcMac, callback) {
  var cmd = 'uci get firewall.block_' + srcMac + '.enabled';
  var enabled = false;
  console.log(cmd);
  exec(cmd, 
    (error, stdout, stderr) => {
    if (error) {
      console.error('exec error:');
    } 
    console.log('stdout' + stdout);
    console.log('stderr' + stderr);
    if(0 == stdout.localeCompare('1'))
      enabled = true;
    console.log('calling callback'); 
    callback(enabled);
  });
}

module.exports = firewall;
