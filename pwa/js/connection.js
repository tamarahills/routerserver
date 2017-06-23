/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';
var Connection = function(conn) {
  console.log('Src is: ' + conn.src);
  this.src = conn.src;
  this.dst = conn.dst
  this.bytes = conn.bytes;
  this.container = document.getElementById('conn-view');
  this.render();
};

Connection.prototype.view = function() {
  return '<div class="connection"><span>'+ this.src + this.dst + this.bytes +'</span></div><P>';
}

Connection.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
}
