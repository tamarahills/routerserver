/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';
var BlockItem= function(device) {
  console.log('Src is: ' + conn.src);
  this.host = device.host;
  this.IP = device.IP
  this.mac = device.mac;
  this.container = document.getElementById('block-view');
  this.render();
};

BlockItem.prototype.view = function() {
  return '<div class="connection"><span>'+ this.host + this.IP + this.mac +'</span></div><P>';
}

BlockItem.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
}
