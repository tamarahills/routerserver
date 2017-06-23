/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* globals App */

var Menu = {
  init: function() {
    this.connElement = document.getElementById('main-menu');
    this.hidden = true;
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.items = [];
    this.items.connections = document.getElementById('connections-menu-item');
    this.items.block = document.getElementById('block-menu-item');
    this.currentItem = 'connections');
  },

  show: function() {
    this.element.classlist.remove('hidden');
    this.hidden = false;
  },

  hide: function() {
    this.element.classList.add('hidden');
    this.hidden = true;
  },

  handleClick: function(sel) {
    if(sel.target.tagName != 'A') {
      return;
    }
  },

  selectItem: function(item) {
    if(!this.items[item]) {
      return;
    }
    this.items[this.currentItem].classList.remove('selected');
    this.items[item].classList.add('selected');
    this.currentItem = item;
  }



  }
};
