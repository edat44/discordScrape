// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Edited by Edward Atkinson for his Notre Dame Spring 2018 Database project: Discord Dashboard

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
 function getCurrentTab(callback) {
     // Query filter to be passed to chrome.tabs.query - see
     // https://developer.chrome.com/extensions/tabs#method-query
     var queryInfo = {
         active: true,
         currentWindow: true
     };

     chrome.tabs.query(queryInfo, (tabs) => {
        var tab = tabs[0];

        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(tab);
    });
}

function saveSettings() {
    getCurrentTabUrl((tab) => {
        alert('Sending message to tab with url ' + tab.url);
        chrome.tabs.sendMessage(tab.id, "hello");
        /*var data = {
            initialDelay: $("input[name=initialDelay]").val(),
            userDelay: $("input[name=userDelay]").val(),
            messageDelay: $("input[name=messageDelay]").val(),
            upload: ($('#check_id').is(":checked")) ? true : false
        };
        alert(data);
        var items = {url: data};
        alert(items);
        chrome.storage.sync.set(items);
        */
    });
}

document.addEventListener('DOMContentLoaded', () => {});
