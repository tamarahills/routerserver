//TODO -- Add MPL

'use strict';
const exec = require('child_process').exec;


function firewall() {
  var self = this;
}

firewall.prototype.enableRule = function(srcMac) {
  var cmd = 'uci set firewall.block_' + srcMac + '.enabled=1 && uci commit';
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


firewall.prototype.createRule = function(srcMac) {
  var ruleNamePrefix = 'uci set firewall.block_' + srcMac;
  var cmd = ruleNamePrefix + '=rule && ' +
    ruleNamePrefix + '.src=lan && ' +
    ruleNamePrefix + '.dest=wan && ' +
    ruleNamePrefix + '.target=REJECT && ' +
    ruleNamePrefix + '.weekdays=\'Sun Mon Tues Wed Thurs Fri Sat\' && ' +
    ruleNamePrefix + '.src_mac=' + srcMac + ' && ' +
    ruleNamePrefix + '.enabled=0 && uci commit';
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
