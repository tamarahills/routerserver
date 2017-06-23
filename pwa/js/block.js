/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* globals BlockItem */

var BlockScreen = {
  init: function() {
    this.blockElement = document.getElementById('block-view');
    this.renderBlockTable();
  },

  renderBlockTable: function() {
    fetch('/devices', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((function(response) {
      return response.json();
    }).bind(this)).then((function(responseData) {
      this.connElement.innerHTML = '';
      responseData.connections.forEach(function(conn) {
        var bi  = new BlockItem(device);
      });
    }).bind(this));
  },
};
