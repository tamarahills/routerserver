/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* globals Connection */

var ConnectionsScreen = {
  init: function() {
    this.connElement = document.getElementById('conn-view');
    this.renderConnTable();
  },

  renderConnTable: function(things) {
    fetch('/connections', {
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
        var connection = new Connection(conn);
      });
    }).bind(this));
  },
};
