/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';
/* globals ConnectionScreen */
var App = {
  HOST: window.location.host,

  ORIGIN: window.location.origin,

  init: function() {
    ConnectionsScreen.init();
    this.views = [];
    this.views.connections = document.getElementById('conn-view');
    this.currentView = 'connections';
  },

  selectView: function(view) {
  }
};

/**
  * Start app on page load.
  */
window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  App.init();
});
